// Pure helpers for the `returnTo` query param used by the auth guard
// (docs/adr/0006-auth-guard-and-commit-points.md). No Firebase imports, so
// these are safe to use from server components.

const AUTH_PATH = /^\/(login|signup|forgot-password)(\/|\?|#|$)/i;

/**
 * Only same-site, absolute paths are allowed. Anything else (full URLs,
 * protocol-relative `//evil.com`, backslash tricks, auth pages that would
 * loop) falls back to the storefront home. This prevents open redirects.
 */
export function safeReturnTo(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//") || raw.includes("\\")) return "/";
  if (AUTH_PATH.test(raw)) return "/";
  return raw;
}

/** `/login?returnTo=/checkout` (or just `/login` when returning home). */
export function withReturnTo(path: "/login" | "/signUp", returnTo: string): string {
  const safe = safeReturnTo(returnTo);
  return safe === "/" ? path : `${path}?returnTo=${encodeURIComponent(safe)}`;
}
