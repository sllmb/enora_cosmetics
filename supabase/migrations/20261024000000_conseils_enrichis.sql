-- =============================================================================
-- Énora Cosmetics — conseils enrichis (Sprint 5)
-- À exécuter dans le SQL Editor Supabase, après 20261023000000_administration.sql.
-- =============================================================================

-- Police du titre, au choix pour chaque article (écriture manuscrite ou classique).
alter table public.articles
  add column police_titre text not null default 'classique'
    check (police_titre in ('classique', 'princesse', 'plume', 'parisienne'));

-- -----------------------------------------------------------------------------
-- Commentaires des articles (RM-14) : clientes connectées, publiés après validation.
-- -----------------------------------------------------------------------------
create table public.commentaires_articles (
  id bigint generated always as identity primary key,
  article_id bigint not null references public.articles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  auteur text not null,                     -- prénom et initiale affichés
  contenu text not null check (char_length(contenu) between 2 and 1000),
  statut public.statut_avis not null default 'en_attente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index commentaires_articles_article_idx
  on public.commentaires_articles (article_id, statut, created_at);
create index commentaires_articles_attente_idx
  on public.commentaires_articles (statut, created_at desc);

create trigger commentaires_articles_updated_at before update on public.commentaires_articles
  for each row execute function public.maj_updated_at();

alter table public.commentaires_articles enable row level security;

create policy commentaires_lecture on public.commentaires_articles for select using (
  statut = 'publie' or user_id = auth.uid() or public.est_admin()
);

-- Dépôt : sur un article publié, en attente de validation, et au plus
-- 5 commentaires en attente par personne (limite le spam).
create policy commentaires_depot on public.commentaires_articles for insert with check (
  user_id = auth.uid()
  and statut = 'en_attente'
  and exists (
    select 1 from public.articles a
    where a.id = article_id and a.publie_le is not null and a.publie_le <= now()
  )
  and (
    select count(*) from public.commentaires_articles c
    where c.user_id = auth.uid() and c.statut = 'en_attente'
  ) < 5
);

create policy commentaires_admin on public.commentaires_articles for all
  using (public.est_admin()) with check (public.est_admin());
