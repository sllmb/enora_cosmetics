import Image from "next/image";
import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Produit } from "@/features/catalogue";
import { cn } from "@/shared/lib/cn";
import { decouperContenu, urlImage } from "../lib/contenu";
import { estManuscrite, type PoliceTitre } from "../lib/polices";
import { ProduitDansArticle } from "./ProduitDansArticle";
import { CLASSES_POLICE } from "./polices";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/*
 * Rendu Markdown des articles, aux couleurs du site. Le HTML brut écrit dans
 * le texte n'est jamais interprété (react-markdown l'ignore par défaut) et les
 * liens externes s'ouvrent dans un nouvel onglet sans transmettre la page d'origine.
 * Les citations reprennent l'écriture choisie pour le titre. Seules les images
 * du stockage du site sont affichées ; les cartes produit sont placées entre
 * les paragraphes.
 */
const composants = (police: PoliceTitre): Components => ({
  h2: ({ children }) => <h2 className="mt-10 mb-4 text-3xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-3 text-2xl">{children}</h3>,
  p: ({ node, children }) => {
    // Une image seule n'est pas un paragraphe : <figure> ne peut pas être dans <p>.
    const enfants = node?.children ?? [];
    const imageSeule =
      enfants.length === 1 && enfants[0]?.type === "element" && enfants[0].tagName === "img";
    return imageSeule ? <>{children}</> : <p className="mb-5 leading-relaxed">{children}</p>;
  },
  ul: ({ children }) => <ul className="mb-5 ml-5 list-disc space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 ml-5 list-decimal space-y-2">{children}</ol>,
  strong: ({ children }) => <strong className="font-medium text-texte">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote
      className={cn(
        "my-8 border-l-2 border-primaire pl-5 text-primaire [&_p]:mb-2",
        CLASSES_POLICE[police],
        estManuscrite(police) ? "text-3xl leading-snug" : "text-2xl italic",
      )}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr aria-hidden className="mx-auto my-10 w-24 border-0 border-t border-primaire/40" />,
  a: ({ href, children }) => {
    const externe = href?.startsWith("http");
    return (
      <a
        href={href}
        className="text-primaire underline underline-offset-4"
        {...(externe && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, title }) => {
    const adresse = typeof src === "string" ? urlImage(src, URL_SUPABASE) : null;
    if (!adresse) return null;
    return (
      <figure className="my-8">
        <Image
          src={adresse}
          alt={alt ?? ""}
          width={1600}
          height={1000}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full rounded-carte"
        />
        {title && (
          <figcaption className="mt-2 text-center text-sm text-texte-attenue">{title}</figcaption>
        )}
      </figure>
    );
  },
  h1: ({ children }) => <h2 className="mt-10 mb-4 text-3xl">{children}</h2>,
});

// Les codes « image:… » ne sont pas des adresses web : on les laisse passer jusqu'au rendu.
const garderCodesImage = (url: string, cle: string) =>
  cle === "src" && url.startsWith("image:") ? url : defaultUrlTransform(url);

type Props = {
  contenu: string;
  police?: PoliceTitre;
  /** Produits cités dans le texte (les autres cartes ne s'affichent pas). */
  produits?: Produit[];
  /** Dans l'éditeur : signale un produit introuvable au lieu de le masquer. */
  apercu?: boolean;
};

export function ContenuArticle({ contenu, police = "classique", produits = [], apercu }: Props) {
  const parSlug = new Map(produits.map((p) => [p.slug, p]));
  return (
    <div className="text-lg text-texte/90">
      {decouperContenu(contenu).map((bloc, i) => {
        if (bloc.type === "texte") {
          return (
            <Markdown
              key={i}
              remarkPlugins={[remarkGfm]}
              components={composants(police)}
              urlTransform={garderCodesImage}
            >
              {bloc.texte}
            </Markdown>
          );
        }
        const produit = parSlug.get(bloc.slug);
        if (produit) return <ProduitDansArticle key={i} produit={produit} />;
        return apercu ? (
          <p
            key={i}
            className="my-6 rounded-controle bg-avertissement-doux p-4 text-sm text-avertissement"
          >
            Produit « {bloc.slug} » introuvable ou masqué : il ne s&apos;affichera pas sur le site.
          </p>
        ) : null;
      })}
    </div>
  );
}
