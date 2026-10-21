"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { IconButton } from "./IconButton";
import { Input } from "./Input";

/** Champ mot de passe avec bouton « Afficher » (pratique sur téléphone). */
export function ChampMotDePasse(props: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-12" />
      <IconButton
        libelle={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-0 right-0 text-texte-attenue"
      >
        {visible ? (
          <EyeOff aria-hidden className="size-4.5" />
        ) : (
          <Eye aria-hidden className="size-4.5" />
        )}
      </IconButton>
    </div>
  );
}
