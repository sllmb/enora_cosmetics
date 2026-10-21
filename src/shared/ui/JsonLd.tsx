/**
 * Données structurées schema.org lues par les moteurs de recherche.
 * « < » est échappé pour qu'un texte saisi en base ne puisse pas fermer la balise.
 */
export function JsonLd({ donnees }: { donnees: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...donnees }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
