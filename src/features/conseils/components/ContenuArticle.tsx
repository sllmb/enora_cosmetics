import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/shared/lib/cn";
import { estManuscrite, type PoliceTitre } from "../lib/polices";
import { CLASSES_POLICE } from "./polices";

/*
 * Rendu Markdown des articles, aux couleurs du site. Le HTML brut écrit dans
 * le texte n'est jamais interprété (react-markdown l'ignore par défaut) et les
 * liens externes s'ouvrent dans un nouvel onglet sans transmettre la page d'origine.
 * Les citations reprennent l'écriture choisie pour le titre.
 */
const composants = (police: PoliceTitre): Components => ({
  h2: ({ children }) => <h2 className="mt-10 mb-4 text-3xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-3 text-2xl">{children}</h3>,
  p: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
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
  img: () => null,
  h1: ({ children }) => <h2 className="mt-10 mb-4 text-3xl">{children}</h2>,
});

type Props = { contenu: string; police?: PoliceTitre };

export function ContenuArticle({ contenu, police = "classique" }: Props) {
  return (
    <div className="text-lg text-texte/90">
      <Markdown remarkPlugins={[remarkGfm]} components={composants(police)}>
        {contenu}
      </Markdown>
    </div>
  );
}
