import { writable } from "svelte/store";
import type { AccountInfo } from "@azure/msal-browser";

export const account = writable<AccountInfo | null>(null);
export const isAuthenticated = writable<boolean>(true);
export const error = writable<Error | null>(null);
