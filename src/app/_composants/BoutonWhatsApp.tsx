"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { env } from "@/shared/config/env";
import { LogoWhatsApp } from "@/shared/ui";

// Pas de bouton flottant là où il masquerait l'action principale (« Passer la commande »,
// « Valider la commande », « Envoyer sur WhatsApp ») : ces pages proposent déjà WhatsApp.
const SANS_BOUTON = ["/panier", "/commande", "/contact"];

function Bouton() {
  const chemin = usePathname();
  if (!env.whatsappNumero) return null;
  if (SANS_BOUTON.some((c) => chemin === c || chemin.startsWith(`${c}/`))) return null;
  const message = encodeURIComponent("Bonjour Énora, j'ai une question sur vos produits.");
  return (
    <a
      href={`https://wa.me/${env.whatsappNumero}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-flottant transition-transform duration-220 hover:scale-105 hover:bg-whatsapp-survol"
    >
      <LogoWhatsApp className="size-8" />
    </a>
  );
}

/** Bouton flottant de contact WhatsApp ; masqué tant que le numéro n'est pas configuré. */
export function BoutonWhatsApp() {
  // Le chemin n'est connu qu'à l'exécution : rien n'est affiché pendant le pré-rendu.
  return (
    <Suspense fallback={null}>
      <Bouton />
    </Suspense>
  );
}
