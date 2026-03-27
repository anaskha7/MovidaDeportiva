import { redirect } from "next/navigation";
import NotificationsPage from "@/components/NotificationsPage";
import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { formatUserName, getSession } from "@/lib/session";

export default async function UserNotificationsPage() {
  const session = await getSession();

  if (session?.role === "admin") {
    redirect("/admin/notificaciones");
  }

  const locale = await getLocale();
  const displayName = formatUserName(session?.name);
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale,
  });

  return (
    <NotificationsPage
      locale={locale}
      displayName={displayName}
      isAdmin={false}
      items={notificationFeed.items}
      notificationCount={notificationFeed.count}
    />
  );
}
