"use client";

import { createBrowserClient } from "@supabase/ssr";
import { lireEnvSupabase } from "@/shared/config/env";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Client navigateur (session de l'utilisateur, soumis à la RLS). Instance unique. */
export function clientNavigateur() {
  if (!client) {
    const { url, cleAnon } = lireEnvSupabase();
    client = createBrowserClient(url, cleAnon);
  }
  return client;
}
