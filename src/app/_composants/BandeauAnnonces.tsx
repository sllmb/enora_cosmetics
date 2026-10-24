const ANNONCES = [
  "Livraison à Dakar et environs",
  "Paiement à la livraison",
  "Wave et Orange Money acceptés",
  "Produits 100 % originaux",
  "Retrait à Yoff sur rendez-vous",
  "Une question ? Écrivez-nous sur WhatsApp",
];

function Annonces({ copie }: { copie?: boolean }) {
  return (
    <ul
      aria-hidden={copie}
      className="flex shrink-0 items-center motion-reduce:[&[aria-hidden]]:hidden"
    >
      {ANNONCES.map((annonce) => (
        <li key={annonce} className="flex items-center whitespace-nowrap">
          {annonce}
          <span aria-hidden className="px-6 text-accent-clair">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Bandeau d'annonces qui défile en continu ; s'arrête au survol, fixe si l'animation est réduite. */
export function BandeauAnnonces() {
  return (
    <section
      aria-label="Annonces"
      className="group overflow-hidden tissu-soie py-2 text-xs tracking-wide text-sur-primaire"
    >
      <div className="flex w-max animate-defilement group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Annonces />
        <Annonces copie />
      </div>
    </section>
  );
}
