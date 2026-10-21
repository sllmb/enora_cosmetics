"use server";

import { redirect } from "next/navigation";
import { env } from "@/shared/config/env";
import { cheminDeRetour } from "@/shared/lib/redirection";
import { creerClientServeur } from "@/shared/supabase/serveur";
import { erreursParChamp, traduireErreurAuth } from "../lib/erreurs";
import {
  connexionSchema,
  inscriptionSchema,
  motDePasseOublieSchema,
  nouveauMotDePasseSchema,
  profilSchema,
} from "../schemas/compte";
import type { ResultatAction } from "../types";

const lienRetour = (suite: string) =>
  `${env.siteUrl}/auth/callback?suite=${encodeURIComponent(suite)}`;

export async function seConnecter(donnees: unknown, suite?: string): Promise<ResultatAction> {
  const saisie = connexionSchema.safeParse(donnees);
  if (!saisie.success) return erreursParChamp(saisie.error);
  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.signInWithPassword({
    email: saisie.data.email,
    password: saisie.data.motDePasse,
  });
  if (error) return traduireErreurAuth(error.code);
  redirect(cheminDeRetour(suite));
}

export async function sInscrire(donnees: unknown): Promise<ResultatAction> {
  const saisie = inscriptionSchema.safeParse(donnees);
  if (!saisie.success) return erreursParChamp(saisie.error);
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.auth.signUp({
    email: saisie.data.email,
    password: saisie.data.motDePasse,
    // Le nom est recopié dans « profils » par le déclencheur creer_profil.
    options: { data: { nom: saisie.data.nom }, emailRedirectTo: lienRetour("/compte") },
  });
  if (error) return traduireErreurAuth(error.code);
  // Confirmation par email désactivée dans Supabase : la session existe déjà.
  if (data.session) redirect("/compte");
  // Message identique que l'email soit nouveau ou déjà inscrit : on ne révèle
  // pas quelles adresses ont un compte.
  return {
    ok: true,
    message: `Un email de confirmation a été envoyé à ${saisie.data.email}. Cliquez sur le lien qu'il contient pour activer votre compte.`,
  };
}

export async function seDeconnecter(): Promise<void> {
  const supabase = await creerClientServeur();
  await supabase.auth.signOut();
  redirect("/");
}

export async function demanderReinitialisation(donnees: unknown): Promise<ResultatAction> {
  const saisie = motDePasseOublieSchema.safeParse(donnees);
  if (!saisie.success) return erreursParChamp(saisie.error);
  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.resetPasswordForEmail(saisie.data.email, {
    redirectTo: lienRetour("/compte/nouveau-mot-de-passe"),
  });
  if (error?.code?.startsWith("over_")) return traduireErreurAuth(error.code);
  return {
    ok: true,
    message: `Si un compte existe pour ${saisie.data.email}, un email avec un lien pour choisir un nouveau mot de passe vient d'être envoyé.`,
  };
}

export async function changerMotDePasse(donnees: unknown): Promise<ResultatAction> {
  const saisie = nouveauMotDePasseSchema.safeParse(donnees);
  if (!saisie.success) return erreursParChamp(saisie.error);
  const supabase = await creerClientServeur();
  const { error } = await supabase.auth.updateUser({ password: saisie.data.motDePasse });
  if (error) return traduireErreurAuth(error.code);
  redirect("/compte?motDePasse=modifie");
}

export async function mettreAJourProfil(donnees: unknown): Promise<ResultatAction> {
  const saisie = profilSchema.safeParse(donnees);
  if (!saisie.success) return erreursParChamp(saisie.error);
  const supabase = await creerClientServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Votre session a expiré. Reconnectez-vous." };

  const { nom, telephone, adresse, zoneId } = saisie.data;
  // La RLS limite la mise à jour au profil de l'utilisatrice connectée.
  const { error } = await supabase
    .from("profils")
    .update({
      nom,
      telephone: telephone || null,
      adresse: adresse || null,
      zone_livraison_id: zoneId || null,
    })
    .eq("user_id", user.id);
  if (error) {
    console.error("mettreAJourProfil :", error);
    return { ok: false, message: "Le profil n'a pas pu être enregistré. Réessayez." };
  }
  return { ok: true, message: "Vos informations sont enregistrées." };
}
