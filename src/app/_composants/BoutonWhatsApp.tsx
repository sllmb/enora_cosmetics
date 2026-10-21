import { MessageCircle } from "lucide-react";
import { env } from "@/shared/config/env";

/** Bouton flottant de contact WhatsApp ; masqué tant que le numéro n'est pas configuré. */
export function BoutonWhatsApp() {
  if (!env.whatsappNumero) return null;
  const message = encodeURIComponent("Bonjour Énora, j'ai une question sur vos produits.");
  return (
    <a
      href={`https://wa.me/${env.whatsappNumero}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-primaire text-sur-primaire shadow-flottant transition-transform duration-220 hover:scale-105"
    >
      <MessageCircle aria-hidden className="size-6" strokeWidth={1.5} />
    </a>
  );
}
