export const ANALYTICS_KEY = "contentmesh-analytics-v1";
export function storedAnalyticsChoice(raw: string | null, now = Date.now()): string | null {
  try {
    const saved = JSON.parse(raw || "null");
    return saved &&
      ["accepted", "rejected"].includes(saved.value) &&
      typeof saved.at === "number" &&
      saved.at <= now &&
      now - saved.at < 180 * 86400000
      ? saved.value
      : null;
  } catch {
    return null;
  }
}
export function isPrivateAnalyticsPath(pathname: string): boolean {
  return /^\/(studio|api|admin|auth|login|dashboard|tools)(\/|$)/.test(pathname);
}
export function analyticsAllowed(
  hostname: string,
  pathname: string,
  choice: string | null,
): boolean {
  return (
    ["contentmeshai.com", "www.contentmeshai.com"].includes(hostname) &&
    !isPrivateAnalyticsPath(pathname) &&
    choice === "accepted"
  );
}
