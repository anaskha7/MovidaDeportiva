import { redirect } from "next/navigation";
import NotificationsPage from "@/components/NotificationsPage";
import { getCurrentUserBySession } from "@/lib/auth";
import {
  getNotificationFeedForSession,
  markNotificationsAsReadForSession,
} from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { formatUserName, getSession } from "@/lib/session";

export default async function UserNotificationsPage() {
  const session = await getSession();

  if (session?.role === "admin") {
    redirect("/admin/notificaciones");
  }

  const locale = await getLocale();
  const currentUser = await getCurrentUserBySession({
    userId: session?.userId,
    email: session?.email,
  });
  const displayName = formatUserName(session?.name);
  await markNotificationsAsReadForSession(session);
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale,
  });

  return (
    <NotificationsPage
      locale={locale}
      displayName={displayName}
      avatarUrl={currentUser?.avatar_url ?? null}
      isAdmin={false}
      items={notificationFeed.items}
      notificationCount={notificationFeed.count}
    />
  );
}
