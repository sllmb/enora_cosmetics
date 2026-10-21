-- =============================================================================
-- Énora Cosmetics — administration (Sprint 4)
-- À exécuter dans le SQL Editor Supabase, après 20261022000000_creation_commande.sql.
-- =============================================================================

-- RM-12 : date de réception du paiement (Wave / Orange Money vérifié, ou payé au livreur).
alter table public.commandes
  add column paiement_recu_le timestamptz;

-- RM-09 : cycle de vie d'une commande, dans une seule transaction.
--   en_attente -> confirmee | annulee
--   confirmee  -> expediee  | annulee
--   expediee   -> livree    | annulee
--   livree et annulee sont définitifs.
-- Une annulation remet en stock les quantités commandées.
-- « security invoker » : s'exécute avec les droits de l'appelant ; seuls les
-- administrateurs peuvent modifier commandes et produits (RLS), et la fonction
-- le vérifie aussi explicitement.
create or replace function public.changer_statut_commande(
  p_reference text,
  p_statut public.statut_commande
)
returns public.statut_commande
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id bigint;
  v_actuel public.statut_commande;
begin
  if not public.est_admin() then
    raise exception 'ACCES_REFUSE';
  end if;

  select id, statut into v_id, v_actuel
  from public.commandes
  where reference = p_reference
  for update;
  if not found then
    raise exception 'COMMANDE_INTROUVABLE';
  end if;

  if v_actuel = p_statut then
    return v_actuel;
  end if;

  if not (
    (v_actuel = 'en_attente' and p_statut in ('confirmee', 'annulee'))
    or (v_actuel = 'confirmee' and p_statut in ('expediee', 'annulee'))
    or (v_actuel = 'expediee' and p_statut in ('livree', 'annulee'))
  ) then
    raise exception 'TRANSITION_INTERDITE';
  end if;

  if p_statut = 'annulee' then
    update public.produits p
    set stock = p.stock + l.quantite
    from public.commande_lignes l
    where l.commande_id = v_id and l.produit_id = p.id;
  end if;

  update public.commandes set statut = p_statut where id = v_id;
  return p_statut;
end;
$$;

revoke all on function public.changer_statut_commande(text, public.statut_commande)
  from public, anon;
grant execute on function public.changer_statut_commande(text, public.statut_commande)
  to authenticated;

-- Tableau de bord et listes de l'administration.
create index if not exists commandes_created_at_idx on public.commandes (created_at desc);
