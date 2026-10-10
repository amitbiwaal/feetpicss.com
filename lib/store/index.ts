import "server-only";
import type { ContentStore } from "../types";
import { fileStore } from "./file-store";
import { tursoStore } from "./turso-store";

export function usesTurso(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

/** Turso when the database is configured (Vercel), JSON files in content/ otherwise (local development). */
export function getStore(): ContentStore {
  return usesTurso() ? tursoStore : fileStore;
}
