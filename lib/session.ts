// Set/clear a lightweight session cookie so middleware can protect routes.
// The actual auth state is managed by Firebase client SDK.

export function setSessionCookie() {
  document.cookie = 'fb_session=1; path=/; max-age=604800; SameSite=Strict';
}

export function clearSessionCookie() {
  document.cookie = 'fb_session=; path=/; max-age=0; SameSite=Strict';
}
