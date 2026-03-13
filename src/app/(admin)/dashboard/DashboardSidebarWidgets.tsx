"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./Dashboard.module.css";

type CalendarEvent = {
  id: string;
  title: string;
  competition: string;
  timeLabel: string;
  isLive?: boolean;
};

const weekDays = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const eventMap: Record<string, CalendarEvent[]> = {
  "2026-02-06": [
    {
      id: "live-1",
      title: "GRAMA vs VILANOVA",
      competition: "3ª Federación - GRUPO V",
      timeLabel: "Ahora",
      isLive: true,
    },
    {
      id: "match-1",
      title: "V.HEBRON vs VILAFRANCA",
      competition: "2ª Federación - GRUPO V",
      timeLabel: "11:30 h",
    },
    {
      id: "match-2",
      title: "VILASSAR vs GRAMA",
      competition: "2ª Nacional - B",
      timeLabel: "12:40 h",
    },
    {
      id: "match-3",
      title: "LES CORTS vs LLEFIÀ",
      competition: "3ª Federación - GRUPO V",
      timeLabel: "14:00 h",
    },
  ],
  "2026-02-09": [
    {
      id: "match-4",
      title: 'UE SANTS vs MANRESA',
      competition: "Primera Catalana",
      timeLabel: "18:00 h",
    },
  ],
  "2026-02-13": [
    {
      id: "match-5",
      title: "BADALONA FUTUR vs EUROPA",
      competition: "2ª Federación",
      timeLabel: "20:15 h",
    },
  ],
  "2026-02-14": [
    {
      id: "match-6",
      title: "MATARÓ vs SABADELL B",
      competition: "Liga Elite",
      timeLabel: "17:30 h",
    },
  ],
  "2026-02-17": [
    {
      id: "match-7",
      title: "CERDANYOLA vs PERALADA",
      competition: "3ª Federación",
      timeLabel: "19:00 h",
    },
  ],
  "2026-02-20": [
    {
      id: "match-8",
      title: "GRANOLLERS vs FE GRANADA",
      competition: "Liga ASOBAL",
      timeLabel: "20:30 h",
    },
  ],
  "2026-02-21": [
    {
      id: "match-9",
      title: "SEAGULL FEM vs EUROPA FEM",
      competition: "Primera Nacional Fem.",
      timeLabel: "12:00 h",
    },
  ],
  "2026-02-24": [
    {
      id: "match-10",
      title: "JOVENTUT B vs GIRONA B",
      competition: "Liga EBA",
      timeLabel: "18:30 h",
    },
  ],
};

function toKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DashboardSidebarWidgets({ locale }: { locale: Locale }) {
  const initialSelected = new Date(2026, 1, 6);
  const [selectedDate, setSelectedDate] = useState(initialSelected);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(initialSelected));

  const intlLocale = locale === "ca" ? "ca-ES" : locale === "en" ? "en-US" : "es-ES";
  const copy = {
    es: {
      today: "Hoy",
      liveNow: "Live now",
      noLive: "No hay directos ahora",
      noLiveText: "Selecciona otro día del calendario para ver los eventos programados.",
      noMore: "No hay más partidos programados para este día.",
      back: "Volver al día principal",
      prev: "Mes anterior",
      next: "Mes siguiente",
    },
    ca: {
      today: "Avui",
      liveNow: "En directe",
      noLive: "No hi ha directes ara",
      noLiveText: "Selecciona un altre dia del calendari per veure els esdeveniments programats.",
      noMore: "No hi ha més partits programats per a aquest dia.",
      back: "Tornar al dia principal",
      prev: "Mes anterior",
      next: "Mes següent",
    },
    en: {
      today: "Today",
      liveNow: "Live now",
      noLive: "No live events right now",
      noLiveText: "Select another day on the calendar to see scheduled events.",
      noMore: "There are no more matches scheduled for this day.",
      back: "Back to main day",
      prev: "Previous month",
      next: "Next month",
    },
  }[locale];

  const monthLabel = new Intl.DateTimeFormat(intlLocale, {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const dayLabel = new Intl.DateTimeFormat(intlLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const days = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const daysInMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0
    ).getDate();
    const startWeekday = (monthStart.getDay() + 6) % 7;

    const items: Array<Date | null> = [];
    for (let index = 0; index < startWeekday; index += 1) items.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      items.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
    }
    return items;
  }, [visibleMonth]);

  const selectedEvents = eventMap[toKey(selectedDate)] ?? [];
  const liveEvent = selectedEvents.find((event) => event.isLive);
  const upcomingEvents = selectedEvents.filter((event) => !event.isLive);

  const eventDays = useMemo(() => new Set(Object.keys(eventMap)), []);

  return (
    <>
      <article className={styles.cardSmall}>
        <div className={styles.cardHeader}>
          <strong>{copy.today}, {dayLabel}</strong>
        </div>

        {liveEvent ? (
          <div className={styles.scheduleItemActive}>
            <div>
              <span className={styles.scheduleLive}>{copy.liveNow}</span>
              <strong>{liveEvent.title}</strong>
              <p>{liveEvent.competition}</p>
            </div>
            <span>{liveEvent.timeLabel}</span>
          </div>
        ) : (
          <div className={styles.scheduleEmpty}>
            <strong>{copy.noLive}</strong>
            <p>{copy.noLiveText}</p>
          </div>
        )}

        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className={styles.scheduleItem}>
              <div>
                <strong>{event.title}</strong>
                <p>{event.competition}</p>
              </div>
              <span>{event.timeLabel}</span>
            </div>
          ))
        ) : !liveEvent ? null : (
          <div className={styles.scheduleEmptyAlt}>
            <p>{copy.noMore}</p>
          </div>
        )}

        <button
          className={styles.linkButton}
          type="button"
          onClick={() => {
            setSelectedDate(initialSelected);
            setVisibleMonth(startOfMonth(initialSelected));
          }}
        >
          {copy.back}
        </button>
      </article>

      <article className={styles.cardSmall}>
        <div className={styles.calendarHeader}>
          <strong className={styles.calendarTitle}>
            {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          </strong>
          <div className={styles.calendarNav}>
            <button
              type="button"
              className={styles.calendarNavButton}
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1)
                )
              }
              aria-label={copy.prev}
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.calendarNavButton}
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)
                )
              }
              aria-label={copy.next}
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.calendarGrid}>
          {weekDays.map((day) => (
            <span key={day} className={styles.calendarWeekday}>
              {day}
            </span>
          ))}
          {days.map((date, index) =>
            date ? (
              <button
                key={date.toISOString()}
                type="button"
                className={[
                  styles.calendarDay,
                  sameDay(date, selectedDate) ? styles.calendarDaySelected : "",
                  eventDays.has(toKey(date)) ? styles.calendarDayEvent : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelectedDate(date)}
              >
                {date.getDate()}
              </button>
            ) : (
              <span key={`empty-${index}`} className={styles.calendarDayEmpty} />
            )
          )}
        </div>
      </article>
    </>
  );
}
