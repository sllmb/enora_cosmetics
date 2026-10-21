export type Utilisatrice = {
  id: string;
  email: string;
  nom: string;
  telephone: string;
  adresse: string;
  zoneId: number | null;
};

export type ResultatAction =
  | { ok: true; message?: string }
  | { ok: false; message: string; erreurs?: Partial<Record<string, string>> };
