import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SEC,
} from "./constants";

export { ADMIN_COOKIE_NAME } from "./constants";

const TOKEN_KEY = ADMIN_COOKIE_NAME;
const SESSION_MAX_AGE_SEC = ADMIN_SESSION_MAX_AGE_SEC;

function setSessionCookie(token: string) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${SESSION_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

function clearSessionCookie() {
  document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0`;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  setSessionCookie(token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  clearSessionCookie();
}

export function isAuthenticated(): boolean {
  return Boolean(getAdminToken());
}
