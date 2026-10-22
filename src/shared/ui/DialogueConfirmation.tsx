"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  /** Bouton qui ouvre la fenêtre. */
  declencheur: ReactNode;
  titre: string;
  description: string;
  libelleConfirmer: string;
  onConfirmer: () => void;
};

/** Demande une confirmation avant une action irréversible (annuler, supprimer…). */
export function DialogueConfirmation({
  declencheur,
  titre,
  description,
  libelleConfirmer,
  onConfirmer,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{declencheur}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-texte/40 data-[state=open]:animate-apparition" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-carte bg-surface p-6 shadow-flottant">
          <Dialog.Title className="font-titre text-2xl">{titre}</Dialog.Title>
          <Dialog.Description className="text-sm text-texte-attenue">
            {description}
          </Dialog.Description>
          <div className="flex flex-wrap justify-end gap-2">
            <Dialog.Close asChild>
              <Button variante="discret">Retour</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button onClick={onConfirmer}>{libelleConfirmer}</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
