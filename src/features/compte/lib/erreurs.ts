import type { z } from "zod";
import type { ResultatAction } from "../types";

type Echec = Extract<ResultatAction, { ok: false }>;

/*
 * Messages des erreurs Supabase Auth, choisis à partir du code stable et
 * jamais du texte anglais renvoyé par le service.
 */
const MESSAGES: Record<string, Echec> = {
  invalid_credentials: { ok: false, message: "Email ou mot de passe incorrect." },
  email_not_confirmed: {
    ok: false,
    message: "Confirmez d'abord votre adresse email grâce au lien reçu par email.",
  },
  user_already_exists: {
    ok: false,
    message:
      "Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez le mot de passe.",
  },
  weak_password: {
    ok: false,
    message: "Ce mot de passe est trop simple.",
    erreurs: { motDePasse: "Choisissez un mot de passe plus difficile à deviner." },
  },
  same_password: {
    ok: false,
    message: "Le nouveau mot de passe doit être différent de l'ancien.",
    erreurs: { motDePasse: "Choisissez un mot de passe différent de l'ancien." },
  },
  over_email_send_rate_limit: {
    ok: false,
    message: "Trop d'emails envoyés récemment. Réessayez dans quelques minutes.",
  },
  over_request_rate_limit: {
    ok: false,
    message: "Trop de tentatives. Réessayez dans quelques minutes.",
  },
};

export function traduireErreurAuth(code: string | undefined): Echec {
  return (
    (code && MESSAGES[code]) || {
      ok: false,
      message: "Une erreur est survenue. Réessayez dans un instant.",
    }
  );
}

/** Erreurs Zod -> { champ: message } (premier message par champ). */
export function erreursParChamp(erreur: z.ZodError): Echec {
  const erreurs: Record<string, string> = {};
  for (const issue of erreur.issues) {
    const champ = String(issue.path[0] ?? "");
    erreurs[champ] ??= issue.message;
  }
  return { ok: false, message: "Certains champs sont à corriger.", erreurs };
}
