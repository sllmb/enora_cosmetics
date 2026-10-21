-- =============================================================================
-- Énora Cosmetics — schéma initial
-- À exécuter dans le SQL Editor Supabase (ou `supabase db push`).
-- Ne jamais modifier une migration déjà appliquée : en ajouter une nouvelle.
-- Les identifiants RM-xx renvoient à docs/analyse-fonctionnelle.md.
-- =============================================================================

create extension if not exists unaccent;

-- -----------------------------------------------------------------------------
-- Utilitaires
-- -----------------------------------------------------------------------------
create or replace function public.maj_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Énumérations
-- -----------------------------------------------------------------------------
create type public.mode_paiement as enum ('livraison', 'wave', 'orange_money', 'whatsapp');
create type public.statut_commande as enum ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee');
create type public.statut_avis as enum ('en_attente', 'publie', 'refuse');

-- -----------------------------------------------------------------------------
-- Administrateurs (RM-01)
-- -----------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.est_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- -----------------------------------------------------------------------------
-- Catalogue
-- -----------------------------------------------------------------------------
create table public.categories (
  id bigint generated always as identity primary key,
  nom text not null,
  slug text not null unique,
  description text,
  ordre int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.produits (
  id bigint generated always as identity primary key,
  categorie_id bigint not null references public.categories (id) on delete restrict,
  nom text not null,
  slug text not null unique,
  accroche text,
  description text,
  conseils_utilisation text,
  composition text,
  contenance text,                          -- ex. « 50 ml », « 100 g »
  notes_olfactives jsonb,                   -- { "tete": [], "coeur": [], "fond": [] } (huiles parfumées)
  famille_olfactive text,                   -- floral, boisé, oriental, frais…
  prix int not null check (prix > 0),       -- FCFA, entier
  prix_promo int check (prix_promo is null or (prix_promo > 0 and prix_promo < prix)), -- RM-03
  stock int not null default 0 check (stock >= 0),                                     -- RM-04
  est_nouveaute boolean not null default false,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index produits_categorie_idx on public.produits (categorie_id) where actif;

create table public.produit_images (
  id bigint generated always as identity primary key,
  produit_id bigint not null references public.produits (id) on delete cascade,
  chemin text not null,                     -- chemin dans le bucket Storage « produits »
  alt text not null default '',
  ordre int not null default 0,
  created_at timestamptz not null default now()
);
create index produit_images_produit_idx on public.produit_images (produit_id, ordre);

-- -----------------------------------------------------------------------------
-- Clients
-- -----------------------------------------------------------------------------
create table public.profils (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nom text,
  telephone text,
  adresse text,
  zone_livraison_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Livraison
-- -----------------------------------------------------------------------------
create table public.zones_livraison (
  id bigint generated always as identity primary key,
  nom text not null,
  frais int not null check (frais >= 0),
  delai text not null,                      -- ex. « 24 h », « 2 à 4 jours »
  ordre int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profils
  add constraint profils_zone_fk foreign key (zone_livraison_id)
  references public.zones_livraison (id) on delete set null;

-- -----------------------------------------------------------------------------
-- Commandes (RM-05 à RM-09)
-- -----------------------------------------------------------------------------
create sequence public.commandes_numero_seq;

create table public.commandes (
  id bigint generated always as identity primary key,
  reference text not null unique,           -- ENR-2026-00001 (RM-07)
  user_id uuid references auth.users (id) on delete set null, -- null = commande invitée
  nom text not null,
  telephone text not null,
  email text,
  adresse text not null,
  zone_livraison_id bigint references public.zones_livraison (id) on delete set null,
  zone_nom text not null,                   -- copie au moment de la commande
  mode_paiement public.mode_paiement not null,
  statut public.statut_commande not null default 'en_attente',
  note text,
  sous_total int not null check (sous_total >= 0),
  frais_livraison int not null check (frais_livraison >= 0),
  total int not null check (total = sous_total + frais_livraison),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index commandes_user_idx on public.commandes (user_id, created_at desc);
create index commandes_statut_idx on public.commandes (statut, created_at desc);

create table public.commande_lignes (
  id bigint generated always as identity primary key,
  commande_id bigint not null references public.commandes (id) on delete cascade,
  produit_id bigint references public.produits (id) on delete set null,
  nom_produit text not null,                -- copie (RM-06 : la commande ne change pas si le produit change)
  prix_unitaire int not null check (prix_unitaire > 0),
  quantite int not null check (quantite between 1 and 20), -- RM-05
  total_ligne int not null check (total_ligne = prix_unitaire * quantite)
);
create index commande_lignes_commande_idx on public.commande_lignes (commande_id);

-- -----------------------------------------------------------------------------
-- Avis (RM-10, RM-11)
-- -----------------------------------------------------------------------------
create table public.avis (
  id bigint generated always as identity primary key,
  produit_id bigint not null references public.produits (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  auteur text not null,                     -- prénom affiché
  note smallint not null check (note between 1 and 5),
  commentaire text check (char_length(commentaire) <= 1000),
  statut public.statut_avis not null default 'en_attente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (produit_id, user_id)              -- un avis par client et par produit
);

-- -----------------------------------------------------------------------------
-- Conseils (articles)
-- -----------------------------------------------------------------------------
create table public.articles (
  id bigint generated always as identity primary key,
  titre text not null,
  slug text not null unique,
  extrait text,
  contenu text not null,                    -- Markdown, rendu sans HTML brut
  image_chemin text,
  publie_le timestamptz,                    -- null = brouillon
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Déclencheurs updated_at
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['categories','produits','profils','zones_livraison','commandes','avis','articles'] loop
    execute format('create trigger %I_updated_at before update on public.%I
                    for each row execute function public.maj_updated_at()', t, t);
  end loop;
end $$;

-- Profil créé automatiquement à l'inscription.
create or replace function public.creer_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profils (user_id, nom) values (new.id, new.raw_user_meta_data ->> 'nom');
  return new;
end;
$$;
create trigger creer_profil_apres_inscription
  after insert on auth.users for each row execute function public.creer_profil();

-- =============================================================================
-- Sécurité : Row Level Security sur TOUTES les tables
-- =============================================================================
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.produits enable row level security;
alter table public.produit_images enable row level security;
alter table public.profils enable row level security;
alter table public.zones_livraison enable row level security;
alter table public.commandes enable row level security;
alter table public.commande_lignes enable row level security;
alter table public.avis enable row level security;
alter table public.articles enable row level security;

-- admins : chacun ne voit que sa propre ligne ; aucune écriture via l'API.
create policy admins_lecture_soi on public.admins for select using (user_id = auth.uid());

-- Catalogue et livraison : lecture publique des éléments actifs, gestion admin.
create policy categories_lecture on public.categories for select using (active or public.est_admin());
create policy categories_admin on public.categories for all using (public.est_admin()) with check (public.est_admin());

create policy produits_lecture on public.produits for select using (actif or public.est_admin());
create policy produits_admin on public.produits for all using (public.est_admin()) with check (public.est_admin());

create policy produit_images_lecture on public.produit_images for select using (true);
create policy produit_images_admin on public.produit_images for all using (public.est_admin()) with check (public.est_admin());

create policy zones_lecture on public.zones_livraison for select using (active or public.est_admin());
create policy zones_admin on public.zones_livraison for all using (public.est_admin()) with check (public.est_admin());

-- Profils : chacun le sien.
create policy profils_soi on public.profils for select using (user_id = auth.uid() or public.est_admin());
create policy profils_maj_soi on public.profils for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Commandes (RM-08) : AUCUNE insertion depuis le navigateur. La Server Action
-- creerCommande relit prix / promos / stock et insère avec la clé service_role.
-- Lecture : la cliente voit les siennes, l'admin voit tout et change le statut.
create policy commandes_lecture on public.commandes for select using (user_id = auth.uid() or public.est_admin());
create policy commandes_admin_maj on public.commandes for update using (public.est_admin()) with check (public.est_admin());

create policy lignes_lecture on public.commande_lignes for select using (
  public.est_admin() or exists (
    select 1 from public.commandes c where c.id = commande_id and c.user_id = auth.uid()
  )
);

-- Avis : publiés visibles par tous ; dépôt réservé aux clients ayant reçu le produit (RM-10),
-- toujours en attente de modération (RM-11).
create policy avis_lecture on public.avis for select using (
  statut = 'publie' or user_id = auth.uid() or public.est_admin()
);
create policy avis_depot on public.avis for insert with check (
  user_id = auth.uid()
  and statut = 'en_attente'
  and exists (
    select 1 from public.commandes c
    join public.commande_lignes l on l.commande_id = c.id
    where c.user_id = auth.uid() and c.statut = 'livree' and l.produit_id = avis.produit_id
  )
);
create policy avis_admin on public.avis for all using (public.est_admin()) with check (public.est_admin());

-- Articles : publiés visibles par tous.
create policy articles_lecture on public.articles for select using (
  (publie_le is not null and publie_le <= now()) or public.est_admin()
);
create policy articles_admin on public.articles for all using (public.est_admin()) with check (public.est_admin());

-- =============================================================================
-- Storage : bucket public « produits » (images), écriture admin uniquement.
-- =============================================================================
insert into storage.buckets (id, name, public) values ('produits', 'produits', true)
on conflict (id) do nothing;

create policy produits_images_admin_ecriture on storage.objects for insert
  with check (bucket_id = 'produits' and public.est_admin());
create policy produits_images_admin_maj on storage.objects for update
  using (bucket_id = 'produits' and public.est_admin());
create policy produits_images_admin_suppr on storage.objects for delete
  using (bucket_id = 'produits' and public.est_admin());
