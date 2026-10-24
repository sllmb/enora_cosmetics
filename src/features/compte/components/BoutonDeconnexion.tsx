import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui";
import { seDeconnecter } from "../actions/compte";

export function BoutonDeconnexion() {
  return (
    <form action={seDeconnecter}>
      <Button type="submit" variante="discret" taille="sm">
        <LogOut aria-hidden className="size-4" strokeWidth={1.5} />
        Se déconnecter
      </Button>
    </form>
  );
}
