import { cn } from "@/shared/lib/cn";

/** Message d'erreur ou de réussite en tête de formulaire. */
export function Message({ ton, children }: { ton: "erreur" | "reussite"; children: string }) {
  return (
    <p
      role={ton === "erreur" ? "alert" : "status"}
      className={cn(
        "rounded-controle p-4 text-sm",
        ton === "erreur" ? "bg-danger-doux text-danger" : "bg-succes-doux text-succes",
      )}
    >
      {children}
    </p>
  );
}
