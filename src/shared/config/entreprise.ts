/**
 * Informations légales et de contact d'Énora : source unique pour les pages
 * À propos, Contact, CGV et Mentions légales. Le numéro WhatsApp / téléphone
 * vient de NEXT_PUBLIC_WHATSAPP_NUMERO (voir env.ts).
 */
export const ENTREPRISE = {
  nom: "Énora Cosmetics",
  formeJuridique: "Entreprise individuelle",
  responsable: "Salamba Diène",
  fondatrices: "Salamba et Penda",
  adresse: "Yoff, Dakar, Sénégal",
  email: "enoraacosmetics@gmail.com",
  horaires: "Du lundi au samedi, de 9 h à 19 h",
  /** À renseigner dès l'immatriculation (laisser null pour ne rien afficher). */
  ninea: null as string | null,
  rccm: null as string | null,
  /** Liens des réseaux sociaux, ajoutés quand ils sont prêts. */
  reseaux: [] as { nom: string; url: string }[],
  /** Mise à jour des CGV et des mentions légales. */
  miseAJourJuridique: "24 octobre 2026",
} as const;
