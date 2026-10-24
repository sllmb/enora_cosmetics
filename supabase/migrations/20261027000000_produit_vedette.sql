-- =============================================================================
-- Énora Cosmetics — produit vedette de l'accueil (Sprint 6)
-- À exécuter dans le SQL Editor Supabase, après 20261026000000_anti_rafale.sql.
-- =============================================================================

-- Le produit présenté dans la grande bande de l'accueil, choisi dans l'administration.
alter table public.produits
  add column vedette boolean not null default false;

-- Un seul produit vedette à la fois.
create unique index produits_une_seule_vedette on public.produits ((true)) where vedette;
