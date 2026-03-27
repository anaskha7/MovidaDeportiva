import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getCurrentUserBySession } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import { formatUserName, getSession } from "@/lib/session";
import AjustesPageClient from "./AjustesPageClient";

export default async function AjustesPage() {
  const session = await getSession();
  const hasLiveNow = hasActiveLiveMatch();
  const currentUser = await getCurrentUserBySession({
    userId: session?.userId,
    email: session?.email,
  });
  const initialLanguage = await getLocale();
  const displayName = formatUserName(currentUser?.nombre ?? session?.name);
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale: initialLanguage,
    limit: 6,
  });

  return (
    <AjustesPageClient
      displayName={displayName}
      email={currentUser?.email ?? session?.email ?? ""}
      role={session?.role ?? "user"}
      initialLanguage={initialLanguage}
      hasLiveNow={hasLiveNow}
      notificationItems={notificationFeed.items}
      notificationCount={notificationFeed.count}
    />
  );
}
