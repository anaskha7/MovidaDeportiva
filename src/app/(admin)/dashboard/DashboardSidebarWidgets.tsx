"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./Dashboard.module.css";

type CalendarEvent = {
  id: string;
  title: string;
  competition: string;
  timeLabel: string;
  dateIso: string;
};

type DashboardSidebarWidgetsProps = {
  locale: Locale;
  todayIso: string;
  events: CalendarEvent[];
};

const weekDays = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
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

function buildEventMap(events: CalendarEvent[]) {
  return events.reduce<Record<string, CalendarEvent[]>>((accumulator, event) => {
    if (!accumulator[event.dateIso]) {
      accumulator[event.dateIso] = [];
    }

    accumulator[event.dateIso].push(event);
    return accumulator;
  }, {});
}

export default function DashboardSidebarWidgets({
  locale,
  todayIso,
  events,
}: DashboardSidebarWidgetsProps) {
  const today = useMemo(() => fromKey(todayIso), [todayIso]);
  const eventMap = useMemo(() => buildEventMap(events), [events]);
  const firstEventDay = useMemo(() => Object.keys(eventMap).sort()[0], [eventMap]);
  const defaultSelectedDate = useMemo(() => {
    if (eventMap[todayIso]?.length) {
      return today;
    }

    return firstEventDay ? fromKey(firstEventDay) : today;
  }, [eventMap, firstEventDay, today, todayIso]);
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(defaultSelectedDate));

  const intlLocale = locale === "ca" ? "ca-ES" : locale === "en" ? "en-US" : "es-ES";
  const copy = {
    es: {
      today: "Hoy",
      scheduled: "Programado",
      noLive: "No hay partidos para este día",
      noLiveText: "Selecciona otro día del calendario para ver los eventos programados.",
      noMore: "No hay más partidos programados para este día.",
      prev: "Mes anterior",
      next: "Mes siguiente",
    },
    ca: {
      today: "Avui",
      scheduled: "Programat",
      noLive: "No hi ha partits per a aquest dia",
      noLiveText: "Selecciona un altre dia del calendari per veure els esdeveniments programats.",
      noMore: "No hi ha més partits programats per a aquest dia.",
      prev: "Mes anterior",
      next: "Mes següent",
    },
    en: {
      today: "Today",
      scheduled: "Scheduled",
      noLive: "There are no matches for this day",
      noLiveText: "Select another day on the calendar to see scheduled events.",
      noMore: "There are no more matches scheduled for this day.",
      prev: "Previous month",
      next: "Next month",
    },
  }[locale];
  const isTodaySelected = sameDay(selectedDate, today);

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
  const featuredEvent = selectedEvents[0];
  const upcomingEvents = selectedEvents.slice(1);
  const eventDays = useMemo(() => new Set(Object.keys(eventMap)), [eventMap]);

  return (
    <>
      <article className={styles.cardSmall}>
        <div className={styles.cardHeader}>
          <strong>{isTodaySelected ? `${copy.today}, ${dayLabel}` : dayLabel}</strong>
        </div>

        {featuredEvent ? (
          <div className={styles.scheduleItemActive}>
            <div>
              <span className={styles.scheduleLive}>{copy.scheduled}</span>
              <strong>{featuredEvent.title}</strong>
              <p>{featuredEvent.competition}</p>
            </div>
            <span>{featuredEvent.timeLabel}</span>
          </div>
        ) : (
          <div className={styles.scheduleEmpty}>
            <strong>{copy.noLive}</strong>
            <p>{copy.noLiveText}</p>
          </div>
        )}

        {featuredEvent && upcomingEvents.length === 0 ? (
          <div className={styles.scheduleEmptyAlt}>
            <p>{copy.noMore}</p>
          </div>
        ) : null}

        {upcomingEvents.length > 0 ? (
          <div
            className={[
              styles.scheduleList,
              styles.scheduleListScrollable,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {upcomingEvents.map((event) => (
              <div key={event.id} className={styles.scheduleItem}>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.competition}</p>
                </div>
                <span>{event.timeLabel}</span>
              </div>
            ))}
          </div>
        ) : null}
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
                key={toKey(date)}
                type="button"
                className={[
                  styles.calendarDay,
                  sameDay(date, selectedDate) ? styles.calendarDaySelected : "",
                  sameDay(date, today) ? styles.calendarDayToday : "",
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
