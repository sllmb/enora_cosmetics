-- =============================================================================
-- Énora Cosmetics — protection contre les commandes en rafale (Sprint 6)
-- À exécuter dans le SQL Editor Supabase, après 20261025000000_durcissement.sql.
-- =============================================================================

-- Empreinte de la connexion qui a passé la commande : HMAC-SHA256 de l'adresse IP,
-- calculé par le serveur du site. L'adresse IP elle-même n'est jamais enregistrée.
-- Sert uniquement à limiter le nombre de commandes par heure (RM-15).
alter table public.commandes
  add column ip_empreinte text;

create index commandes_ip_recentes_idx
  on public.commandes (ip_empreinte, created_at desc)
  where ip_empreinte is not null;

create index commandes_telephone_recentes_idx
  on public.commandes (telephone, created_at desc);

-- L'empreinte est calculée avec une clé secrète du serveur : même lue, elle ne
-- permet pas de retrouver l'adresse IP. Les règles d'accès existantes s'appliquent
-- (une cliente ne voit que ses commandes, l'administration toutes).
