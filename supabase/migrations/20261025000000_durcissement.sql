-- =============================================================================
-- Énora Cosmetics — durcissement de la sécurité (audit)
-- À exécuter dans le SQL Editor Supabase, après 20261024000000_conseils_enrichis.sql.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Fonction des dates de mise à jour : chemin de recherche figé
--    (protège contre une fonction homonyme placée dans un autre schéma).
-- -----------------------------------------------------------------------------
alter function public.maj_updated_at() set search_path = public;

-- -----------------------------------------------------------------------------
-- 2. Nom affiché des avis et commentaires imposé par la base
--    Prénom et initiale du nom du profil (« Awa Ndiaye » -> « Awa N. ») :
--    une cliente ne peut plus signer à la place de quelqu'un d'autre, même en
--    écrivant directement dans la base.
-- -----------------------------------------------------------------------------
create or replace function public.nom_public(p_user_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_mots text[];
begin
  select regexp_split_to_array(btrim(nom), '\s+')
    into v_mots
    from public.profils
   where user_id = p_user_id;
  if v_mots is null or coalesce(v_mots[1], '') = '' then
    return 'Cliente Énora';
  end if;
  if array_length(v_mots, 1) = 1 then
    return v_mots[1];
  end if;
  return v_mots[1] || ' ' || upper(left(v_mots[array_length(v_mots, 1)], 1)) || '.';
end;
$$;

revoke all on function public.nom_public(uuid) from public, anon, authenticated;

create or replace function public.imposer_auteur()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.auteur := public.nom_public(new.user_id);
  return new;
end;
$$;

revoke all on function public.imposer_auteur() from public, anon, authenticated;

create trigger avis_auteur before insert on public.avis
  for each row execute function public.imposer_auteur();
create trigger commentaires_articles_auteur before insert on public.commentaires_articles
  for each row execute function public.imposer_auteur();

-- -----------------------------------------------------------------------------
-- 3. Identifiant des clientes caché au public
--    La colonne user_id des avis et commentaires n'est plus lisible par le site
--    (visiteurs comme clientes connectées). Les règles d'accès (RLS) continuent
--    de l'utiliser en interne ; l'écriture n'est pas modifiée.
-- -----------------------------------------------------------------------------
revoke select on public.avis from anon, authenticated;
grant select (id, produit_id, auteur, note, commentaire, statut, created_at, updated_at)
  on public.avis to anon, authenticated;

revoke select on public.commentaires_articles from anon, authenticated;
grant select (id, article_id, auteur, contenu, statut, created_at, updated_at)
  on public.commentaires_articles to anon, authenticated;

-- RM-14 : la limite de 5 commentaires en attente comptait les lignes via user_id,
-- désormais illisible pour la cliente : le comptage passe par une fonction.
create or replace function public.commentaires_en_attente()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer from public.commentaires_articles
   where user_id = auth.uid() and statut = 'en_attente';
$$;

revoke all on function public.commentaires_en_attente() from public, anon;
grant execute on function public.commentaires_en_attente() to authenticated;

drop policy commentaires_depot on public.commentaires_articles;
create policy commentaires_depot on public.commentaires_articles for insert with check (
  user_id = auth.uid()
  and statut = 'en_attente'
  and exists (
    select 1 from public.articles a
    where a.id = article_id and a.publie_le is not null and a.publie_le <= now()
  )
  and public.commentaires_en_attente() < 5
);

-- RM-10 : la cliente connectée a-t-elle déjà donné son avis sur ce produit ?
-- (remplace la lecture directe de user_id, désormais masquée)
create or replace function public.avis_deja_donne(p_produit_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.avis
     where produit_id = p_produit_id and user_id = auth.uid()
  );
$$;

revoke all on function public.avis_deja_donne(bigint) from public, anon;
grant execute on function public.avis_deja_donne(bigint) to authenticated;
