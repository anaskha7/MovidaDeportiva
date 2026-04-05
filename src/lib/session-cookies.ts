export const SESSION_COOKIE_TOKEN = "mdv_session";
export const SESSION_COOKIE_ROLE = "mdv_role";
export const SESSION_COOKIE_NAME = "mdv_name";
export const SESSION_COOKIE_USER_ID = "mdv_user_id";
export const SESSION_COOKIE_EMAIL = "mdv_email";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function getExpiredSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
