"use client";

import { useSyncExternalStore } from "react";

const sAbonner = () => () => {};

/**
 * Vrai une fois le JavaScript de la page chargé. Sert à griser un bouton
 * d'envoi tant qu'un clic ne déclencherait pas encore l'action prévue.
 */
export function useEstPret(): boolean {
  return useSyncExternalStore(
    sAbonner,
    () => true,
    () => false,
  );
}
