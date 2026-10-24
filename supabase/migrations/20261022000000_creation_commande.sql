-- =============================================================================
-- Énora Cosmetics — création de commande atomique (RM-05 à RM-08)
-- À exécuter dans le SQL Editor Supabase, après 20261021000000_schema_initial.sql.
-- =============================================================================

-- Clé secrète d'accès à la page de confirmation : la référence (ENR-2026-00001)
-- se devine, la clé non. Sans elle, impossible de voir la commande d'un autre.
alter table public.commandes
  add column cle_suivi uuid not null default gen_random_uuid();

-- Tout se passe dans une seule transaction : produits verrouillés, stock
-- vérifié, prix et frais relus en base, commande + lignes insérées, stock
-- décrémenté. Une seule erreur et rien n'est enregistré.
-- Les erreurs ont un code stable (« STOCK_INSUFFISANT:slug ») lu par l'application.
create or replace function public.creer_commande(
  p_client jsonb,            -- { nom, telephone, email, adresse, note }
  p_zone_id bigint,
  p_mode public.mode_paiement,
  p_lignes jsonb,            -- [{ "slug": "...", "quantite": 2 }]
  p_user_id uuid default null
)
returns table (o_reference text, o_cle_suivi uuid, o_total int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_zone public.zones_livraison;
  v_produit public.produits;
  v_ligne record;
  v_prix int;
  v_sous_total int := 0;
  v_lignes jsonb := '[]'::jsonb;
  v_commande_id bigint;
  v_reference text;
  v_cle uuid;
begin
  if p_lignes is null or jsonb_typeof(p_lignes) <> 'array' or jsonb_array_length(p_lignes) = 0 then
    raise exception 'PANIER_VIDE';
  end if;
  if jsonb_array_length(p_lignes) > 50 then
    raise exception 'PANIER_TROP_GRAND';
  end if;

  select * into v_zone from public.zones_livraison where id = p_zone_id and active;
  if not found then
    raise exception 'ZONE_INVALIDE';
  end if;

  -- Ordre fixe des verrous (par slug) : deux commandes simultanées ne se bloquent pas mutuellement.
  for v_ligne in
    select x.slug, sum(x.quantite)::int as quantite
    from jsonb_to_recordset(p_lignes) as x(slug text, quantite int)
    group by x.slug
    order by x.slug
  loop
    -- RM-05 : 1 à 20 par produit.
    if v_ligne.quantite is null or v_ligne.quantite < 1 or v_ligne.quantite > 20 then
      raise exception 'QUANTITE_INVALIDE:%', v_ligne.slug;
    end if;

    -- RM-02 : produit actif d'une catégorie active.
    select p.* into v_produit
    from public.produits p
    join public.categories c on c.id = p.categorie_id
    where p.slug = v_ligne.slug and p.actif and c.active
    for update of p;
    if not found then
      raise exception 'PRODUIT_INDISPONIBLE:%', v_ligne.slug;
    end if;

    -- RM-04 / RM-05 : jamais plus que le stock.
    if v_produit.stock < v_ligne.quantite then
      raise exception 'STOCK_INSUFFISANT:%', v_ligne.slug;
    end if;

    -- RM-03 : le prix promo ne s'applique que s'il est inférieur au prix.
    v_prix := case
      when v_produit.prix_promo is not null and v_produit.prix_promo < v_produit.prix
        then v_produit.prix_promo
      else v_produit.prix
    end;
    v_sous_total := v_sous_total + v_prix * v_ligne.quantite;
    v_lignes := v_lignes || jsonb_build_object(
      'produit_id', v_produit.id,
      'nom', v_produit.nom,
      'prix', v_prix,
      'quantite', v_ligne.quantite
    );
  end loop;

  -- RM-07 : référence lisible, année de Dakar.
  v_reference := 'ENR-' || to_char(now() at time zone 'Africa/Dakar', 'YYYY') || '-'
    || lpad(nextval('public.commandes_numero_seq')::text, 5, '0');

  insert into public.commandes (
    reference, user_id, nom, telephone, email, adresse,
    zone_livraison_id, zone_nom, mode_paiement, note,
    sous_total, frais_livraison, total
  )
  values (
    v_reference, p_user_id, p_client ->> 'nom', p_client ->> 'telephone',
    nullif(p_client ->> 'email', ''), p_client ->> 'adresse',
    v_zone.id, v_zone.nom, p_mode, nullif(p_client ->> 'note', ''),
    v_sous_total, v_zone.frais, v_sous_total + v_zone.frais
  )
  returning id, cle_suivi into v_commande_id, v_cle;

  -- RM-06 : nom et prix copiés, l'historique ne bouge plus.
  insert into public.commande_lignes (commande_id, produit_id, nom_produit, prix_unitaire, quantite, total_ligne)
  select v_commande_id,
         (l ->> 'produit_id')::bigint,
         l ->> 'nom',
         (l ->> 'prix')::int,
         (l ->> 'quantite')::int,
         (l ->> 'prix')::int * (l ->> 'quantite')::int
  from jsonb_array_elements(v_lignes) as l;

  update public.produits p
  set stock = p.stock - (l ->> 'quantite')::int
  from jsonb_array_elements(v_lignes) as l
  where p.id = (l ->> 'produit_id')::bigint;

  return query select v_reference, v_cle, v_sous_total + v_zone.frais;
end;
$$;

-- RM-08 : seul le serveur du site (clé service_role) peut créer une commande.
revoke all on function public.creer_commande(jsonb, bigint, public.mode_paiement, jsonb, uuid)
  from public, anon, authenticated;
grant execute on function public.creer_commande(jsonb, bigint, public.mode_paiement, jsonb, uuid)
  to service_role;
