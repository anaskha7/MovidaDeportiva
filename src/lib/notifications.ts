import type { Locale } from "@/lib/i18n-shared";

export type NotificationItem = {
  actor?: string;
  message: string;
};

const notificationsByLocale: Record<Locale, NotificationItem[]> = {
  es: [
    { actor: "@futbol_008", message: "ha reaccionado a tu mensaje" },
    { message: "Has reservado los Servicios Streaming para el 18/03 con éxito." },
    { actor: "@juannn_mp", message: "ha contestado tu mensaje de chat" },
    { actor: "@futbol_008", message: "ha reaccionado a tu mensaje" },
  ],
  ca: [
    { actor: "@futbol_008", message: "ha reaccionat al teu missatge" },
    { message: "Has reservat els Serveis Streaming per al 18/03 amb èxit." },
    { actor: "@juannn_mp", message: "ha contestat el teu missatge del xat" },
    { actor: "@futbol_008", message: "ha reaccionat al teu missatge" },
  ],
  en: [
    { actor: "@futbol_008", message: "reacted to your message" },
    { message: "You booked the Streaming Services for 03/18 successfully." },
    { actor: "@juannn_mp", message: "replied to your chat message" },
    { actor: "@futbol_008", message: "reacted to your message" },
  ],
};

export function getNotificationItems(locale: Locale) {
  return notificationsByLocale[locale];
}
