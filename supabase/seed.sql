-- Données de démonstration (développement uniquement). Aucune donnée personnelle réelle.
-- Prix et zones indicatifs : à remplacer par les vraies valeurs avant la mise en ligne.

insert into public.categories (nom, slug, description, ordre) values
  ('Déodorants', 'deodorants', 'Une fraîcheur qui dure, en douceur pour la peau.', 1),
  ('Huiles parfumées', 'huiles-parfumees', 'Le parfum en petit flacon, à emporter partout.', 2),
  ('Savons', 'savons', 'Des savons délicatement parfumés pour chaque jour.', 3);

insert into public.zones_livraison (nom, frais, delai, ordre) values
  ('Dakar (centre et Plateau)', 1500, '24 h', 1),
  ('Dakar banlieue (Pikine, Guédiawaye, Rufisque)', 2500, '24 à 48 h', 2),
  ('Thiès, Mbour, Saly', 3500, '2 à 3 jours', 3),
  ('Autres régions', 5000, '3 à 5 jours', 4);

insert into public.produits
  (categorie_id, nom, slug, accroche, contenance, prix, prix_promo, stock, est_nouveaute, famille_olfactive, notes_olfactives)
select c.id, p.nom, p.slug, p.accroche, p.contenance, p.prix, p.prix_promo, p.stock, p.nouveaute, p.famille, p.notes::jsonb
from (values
  ('deodorants', 'Déodorant Fleur de coton', 'deodorant-fleur-de-coton', 'Fraîcheur douce, sans traces', '50 ml', 4500, null, 30, true, 'frais', null),
  ('deodorants', 'Déodorant Musc blanc', 'deodorant-musc-blanc', 'Un sillage poudré et rassurant', '50 ml', 4500, 3900, 20, false, 'musque', null),
  ('deodorants', 'Déodorant Brume fraîche', 'deodorant-brume-fraiche', 'Le spray qui réveille', '150 ml', 5000, null, 12, false, 'frais', null),
  ('huiles-parfumees', 'Huile parfumée Ambre & Oud', 'huile-parfumee-ambre-oud', 'Chaude, boisée, envoûtante', '10 ml', 7500, null, 15, true, 'oriental',
    '{"tete":["Bergamote"],"coeur":["Rose"],"fond":["Ambre","Oud"]}'),
  ('huiles-parfumees', 'Huile parfumée Jasmin', 'huile-parfumee-jasmin', 'Florale et lumineuse', '10 ml', 6500, null, 25, false, 'floral',
    '{"tete":["Néroli"],"coeur":["Jasmin"],"fond":["Musc"]}'),
  ('huiles-parfumees', 'Huile parfumée Santal & Vanille', 'huile-parfumee-santal-vanille', 'Douce, crémeuse, enveloppante', '10 ml', 7000, 6000, 8, true, 'boise',
    '{"tete":["Cardamome"],"coeur":["Santal"],"fond":["Vanille","Tonka"]}'),
  ('savons', 'Savon Karité & Vanille', 'savon-karite-vanille', 'Doux et nourrissant', '100 g', 2500, null, 40, false, 'gourmand', null),
  ('savons', 'Savon Fleur d''oranger', 'savon-fleur-oranger', 'Une mousse légère et parfumée', '100 g', 2500, 2000, 0, false, 'floral', null),
  ('savons', 'Savon Ambre noir', 'savon-ambre-noir', 'Intense et raffiné', '100 g', 3000, null, 18, true, 'oriental', null)
) as p(categorie, nom, slug, accroche, contenance, prix, prix_promo, stock, nouveaute, famille, notes)
join public.categories c on c.slug = p.categorie;
