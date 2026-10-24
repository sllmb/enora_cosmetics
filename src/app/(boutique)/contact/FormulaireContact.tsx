"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { Button, FormField, Input, LogoWhatsApp, Textarea } from "@/shared/ui";

const SUJETS = ["Une question sur un produit", "Le suivi de ma commande", "Autre chose"] as const;

type Props = { whatsapp?: string; email: string };

/**
 * Aucun envoi par le site : le message est préparé puis ouvert dans WhatsApp
 * (ou la messagerie e-mail) de la cliente, qui l'envoie elle-même.
 */
export function FormulaireContact({ whatsapp, email }: Props) {
  const [prenom, setPrenom] = useState("");
  const [sujet, setSujet] = useState<(typeof SUJETS)[number]>(SUJETS[0]);
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [tente, setTente] = useState(false);

  const erreurs = {
    prenom: prenom.trim() ? undefined : "Indiquez votre prénom.",
    message: message.trim().length >= 5 ? undefined : "Écrivez votre message.",
  };
  const valide = !erreurs.prenom && !erreurs.message;
  const texte = [
    `Bonjour Énora, je suis ${prenom.trim()}.`,
    `Sujet : ${sujet}${reference.trim() ? ` (commande ${reference.trim().toUpperCase()})` : ""}`,
    "",
    message.trim(),
  ].join("\n");

  const ouvrir = (canal: "whatsapp" | "email") => {
    setTente(true);
    if (!valide) return;
    const adresse =
      canal === "whatsapp" && whatsapp
        ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(texte)}`
        : `mailto:${email}?subject=${encodeURIComponent(`Énora — ${sujet}`)}&body=${encodeURIComponent(texte)}`;
    window.open(adresse, "_blank", "noopener,noreferrer");
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        ouvrir(whatsapp ? "whatsapp" : "email");
      }}
      className="flex flex-col gap-4 rounded-carte border border-bordure bg-surface p-6"
    >
      <FormField libelle="Votre prénom" obligatoire erreur={tente ? erreurs.prenom : undefined}>
        <Input
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          autoComplete="given-name"
        />
      </FormField>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Sujet</legend>
        <div className="flex flex-wrap gap-2">
          {SUJETS.map((s) => (
            <label
              key={s}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primaire",
                sujet === s
                  ? "border-primaire tissu-soie text-sur-primaire"
                  : "border-bordure hover:border-primaire",
              )}
            >
              <input
                type="radio"
                name="sujet"
                value={s}
                checked={sujet === s}
                onChange={() => setSujet(s)}
                className="sr-only"
              />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      {sujet === "Le suivi de ma commande" && (
        <FormField
          libelle="Référence de la commande"
          aide="Par exemple ENR-2026-00012. Facultatif."
        >
          <Input value={reference} onChange={(e) => setReference(e.target.value)} />
        </FormField>
      )}
      <FormField libelle="Votre message" obligatoire erreur={tente ? erreurs.message : undefined}>
        <Textarea
          rows={5}
          maxLength={1500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </FormField>
      <div className="flex flex-wrap items-center gap-3">
        {whatsapp && (
          <Button type="submit" variante="whatsapp">
            <LogoWhatsApp className="size-4" /> Envoyer sur WhatsApp
          </Button>
        )}
        <Button
          type={whatsapp ? "button" : "submit"}
          variante={whatsapp ? "secondaire" : "primaire"}
          onClick={whatsapp ? () => ouvrir("email") : undefined}
        >
          <Mail aria-hidden className="size-4" /> Envoyer par e-mail
        </Button>
      </div>
      <p className="text-xs text-texte-attenue">
        Votre message s&apos;ouvre, déjà rédigé, dans WhatsApp ou votre messagerie : il ne vous
        reste qu&apos;à l&apos;envoyer.
      </p>
    </form>
  );
}
