import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getCurrentUserBySession } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
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
  const activeSubscription =
    currentUser?.id_usuario != null
      ? await prisma.suscripcion.findFirst({
          where: {
            id_usuario: currentUser.id_usuario,
          },
          orderBy: [
            { estado: "asc" },
            { fecha_inicio: "desc" },
          ],
          select: {
            plan: true,
            estado: true,
          },
        })
      : null;
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale: initialLanguage,
    limit: 6,
  });

  return (
    <AjustesPageClient
      displayName={displayName}
      email={currentUser?.email ?? session?.email ?? ""}
      avatarUrl={currentUser?.avatar_url ?? null}
      role={session?.role ?? "user"}
      initialLanguage={initialLanguage}
      hasLiveNow={hasLiveNow}
      notificationItems={notificationFeed.items}
      notificationCount={notificationFeed.count}
      subscriptionPlan={activeSubscription?.plan ?? null}
      subscriptionStatus={activeSubscription?.estado ?? null}
    />
  );
}
