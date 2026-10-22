import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { exigerAdmin } from "@/features/compte/serveur";
import { supabaseEstConfiguree } from "@/shared/config/env";
import { creerClientPublic } from "@/shared/supabase/public";
import { creerClientServeur } from "@/shared/supabase/serveur";
import type { Avis, AvisAdmin, DroitAvis, StatutAvis } from "../types";

export const TAG_AVIS = "avis";

const avisSchema = z.object({
  id: z.number(),
  auteur: z.string(),
  note: z.number(),
  commentaire: z.string().nullable(),
  created_at: z.string(),
});

const versAvis = (ligne: z.infer<typeof avisSchema>): Avis => ({
  id: ligne.id,
  auteur: ligne.auteur,
  note: ligne.note,
  commentaire: ligne.commentaire,
  creeLe: ligne.created_at,
});

/** RM-11 : seuls les avis publiés sont visibles. Mis en cache, invalidé à la modération. */
export async function listerAvisProduit(produitId: number): Promise<Avis[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_AVIS);
  if (!supabaseEstConfiguree()) return [];
  const { data, error } = await creerClientPublic()
    .from("avis")
    .select("id, auteur, note, commentaire, created_at")
    .eq("produit_id", produitId)
    .eq("statut", "publie")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(`Lecture des avis : ${error.message}`);
  return z.array(avisSchema).parse(data).map(versAvis);
}

/**
 * RM-10 : peut donner son avis la cliente connectée dont une commande livrée
 * contient le produit, une seule fois. La RLS applique la même règle à l'insertion.
 * Lit la session : à appeler sous <Suspense>.
 */
export async function lireDroitAvis(produitId: number): Promise<DroitAvis> {
  if (!supabaseEstConfiguree()) return "connexion";
  const supabase = await creerClientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "connexion";

  const [dejaDonne, recu] = await Promise.all([
    supabase.from("avis").select("id").eq("produit_id", produitId).eq("user_id", user.id).limit(1),
    // RLS : la cliente ne lit que ses propres commandes.
    supabase
      .from("commandes")
      .select("id, commande_lignes!inner(produit_id)")
      .eq("statut", "livree")
      .eq("commande_lignes.produit_id", produitId)
      .limit(1),
  ]);
  if (dejaDonne.data?.length) return "deja";
  return recu.data?.length ? "eligible" : "non_eligible";
}

const avisAdminSchema = avisSchema.extend({
  statut: z.enum(["en_attente", "publie", "refuse"]),
  produits: z.object({ nom: z.string(), slug: z.string() }),
});

export async function listerAvisAdmin(statut?: StatutAvis): Promise<AvisAdmin[]> {
  const { supabase } = await exigerAdmin();
  let requete = supabase
    .from("avis")
    .select("id, auteur, note, commentaire, created_at, statut, produits(nom, slug)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (statut) requete = requete.eq("statut", statut);
  const { data, error } = await requete;
  if (error) throw new Error(`Lecture des avis : ${error.message}`);
  return z
    .array(avisAdminSchema)
    .parse(data)
    .map((ligne) => ({
      ...versAvis(ligne),
      statut: ligne.statut,
      produitNom: ligne.produits.nom,
      produitSlug: ligne.produits.slug,
    }));
}

export async function compterAvisEnAttente(): Promise<number> {
  const { supabase } = await exigerAdmin();
  const { count } = await supabase
    .from("avis")
    .select("id", { count: "exact", head: true })
    .eq("statut", "en_attente");
  return count ?? 0;
}
