import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "./i18n-shared";

export type { Locale } from "./i18n-shared";
export { LOCALE_COOKIE } from "./i18n-shared";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;

  if (saved === "es" || saved === "ca" || saved === "en") {
    return saved;
  }

  return "es";
}
