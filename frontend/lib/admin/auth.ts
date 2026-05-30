/** Nome do cookie lido pelo middleware (proteção server-side) */
export const ADMIN_COOKIE_NAME = "le-maia-admin-token";

const TOKEN_KEY = ADMIN_COOKIE_NAME;
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

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
