import { getLocale } from "@/lib/i18n";
import { formatUserName, getSession } from "@/lib/session";
import AjustesPageClient from "./AjustesPageClient";

export default async function AjustesPage() {
  const session = await getSession();
  const initialLanguage = await getLocale();
  const displayName = formatUserName(session?.name);

  return (
    <AjustesPageClient
      displayName={displayName}
      role={session?.role ?? "user"}
      initialLanguage={initialLanguage}
    />
  );
}
