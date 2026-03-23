"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./Dashboard.module.css";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
};

type ScheduledMatch = {
  id: string;
  title: string;
  competition: string;
  date: string;
  time: string;
};

const initialUsers: AdminUser[] = [
  { id: "u-admin", name: "Admin", email: "admin@example.com", role: "admin", blocked: false },
  { id: "u-user", name: "Usuario Demo", email: "user@example.com", role: "user", blocked: false },
  { id: "u-subscriber", name: "Suscriptor Demo", email: "suscriptor@example.com", role: "suscriptor", blocked: false },
  { id: "u-live-1", name: "Lucía", email: "lucia@demo.com", role: "user", blocked: false },
  { id: "u-live-2", name: "Carlos", email: "carlos@demo.com", role: "suscriptor", blocked: true },
  { id: "u-live-3", name: "Marta", email: "marta@demo.com", role: "user", blocked: false },
];

const initialMatches: ScheduledMatch[] = [
  {
    id: "m-1",
    title: "GRAMA vs VILANOVA",
    competition: "3ª Federación - Grupo V",
    date: "2026-03-18",
    time: "18:30",
  },
  {
    id: "m-2",
    title: "SEAGULL FEM vs EUROPA FEM",
    competition: "Primera Nacional Fem.",
    date: "2026-03-21",
    time: "12:00",
  },
];

const initialRequests = [
  { id: "r-1", club: "UE Sants", service: "Streaming", status: "Pendiente" },
  { id: "r-2", club: "Grama", service: "Speakers", status: "Confirmada" },
  { id: "r-3", club: "Europa FEM", service: "Streaming", status: "Pendiente" },
];

export default function AdminDashboardPanel({ locale }: { locale: Locale }) {
  const t = {
    es: {
      title: "Panel de control admin",
      subtitle: "Gestiona usuarios, moderación en directo, calendario y solicitudes.",
      users: "Usuarios",
      blocked: "Usuarios bloqueados",
      liveModeration: "Moderación en directos",
      calendar: "Añadir partidos al calendario",
      requests: "Solicitudes recientes",
      searchUsers: "Buscar usuario...",
      noBlocked: "No hay usuarios bloqueados",
      block: "Bloquear",
      unblock: "Desbloquear",
      addMatch: "Añadir partido",
      titleLabel: "Partido",
      competitionLabel: "Competición",
      dateLabel: "Fecha",
      timeLabel: "Hora",
      scheduled: "Programados",
      pending: "Pendiente",
    },
    ca: {
      title: "Panell de control admin",
      subtitle: "Gestiona usuaris, moderació en directe, calendari i sol·licituds.",
      users: "Usuaris",
      blocked: "Usuaris bloquejats",
      liveModeration: "Moderació en directes",
      calendar: "Afegir partits al calendari",
      requests: "Sol·licituds recents",
      searchUsers: "Cercar usuari...",
      noBlocked: "No hi ha usuaris bloquejats",
      block: "Bloquejar",
      unblock: "Desbloquejar",
      addMatch: "Afegir partit",
      titleLabel: "Partit",
      competitionLabel: "Competició",
      dateLabel: "Data",
      timeLabel: "Hora",
      scheduled: "Programats",
      pending: "Pendent",
    },
    en: {
      title: "Admin control panel",
      subtitle: "Manage users, live moderation, calendar and requests.",
      users: "Users",
      blocked: "Blocked users",
      liveModeration: "Live moderation",
      calendar: "Add matches to calendar",
      requests: "Recent requests",
      searchUsers: "Search user...",
      noBlocked: "No blocked users",
      block: "Block",
      unblock: "Unblock",
      addMatch: "Add match",
      titleLabel: "Match",
      competitionLabel: "Competition",
      dateLabel: "Date",
      timeLabel: "Time",
      scheduled: "Scheduled",
      pending: "Pending",
    },
  }[locale];

  const [users, setUsers] = useState(initialUsers);
  const [scheduledMatches, setScheduledMatches] = useState(initialMatches);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    title: "",
    competition: "",
    date: "2026-03-25",
    time: "18:00",
  });

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return users.filter((user) =>
      !normalized ||
      `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(normalized)
    );
  }, [query, users]);

  const blockedUsers = users.filter((user) => user.blocked);

  return (
    <section className={styles.adminPanelSection}>
      <div className={styles.adminPanelHeader}>
        <div>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className={styles.adminPanelGrid}>
        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.users}</strong>
            <input
              className={styles.adminSearch}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchUsers}
            />
          </div>
          <div className={styles.adminList}>
            {filteredUsers.map((user) => (
              <div key={user.id} className={styles.adminListItem}>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <span className={styles.adminMeta}>{user.role}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.blocked}</strong>
          </div>
          {blockedUsers.length > 0 ? (
            <div className={styles.adminList}>
              {blockedUsers.map((user) => (
                <div key={user.id} className={styles.adminListItem}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.adminActionButton}
                    onClick={() =>
                      setUsers((current) =>
                        current.map((item) =>
                          item.id === user.id ? { ...item, blocked: false } : item
                        )
                      )
                    }
                  >
                    {t.unblock}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.adminEmpty}>{t.noBlocked}</p>
          )}
        </article>

        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.liveModeration}</strong>
          </div>
          <div className={styles.adminList}>
            {users
              .filter((user) => user.role !== "admin")
              .map((user) => (
                <div key={user.id} className={styles.adminListItem}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.blocked ? t.blocked : t.liveModeration}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.adminActionButton}
                    onClick={() =>
                      setUsers((current) =>
                        current.map((item) =>
                          item.id === user.id ? { ...item, blocked: !item.blocked } : item
                        )
                      )
                    }
                  >
                    {user.blocked ? t.unblock : t.block}
                  </button>
                </div>
              ))}
          </div>
        </article>

        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.calendar}</strong>
          </div>
          <form
            className={styles.adminForm}
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.title || !form.competition) return;
              setScheduledMatches((current) => [
                ...current,
                {
                  id: `match-${Date.now()}`,
                  title: form.title,
                  competition: form.competition,
                  date: form.date,
                  time: form.time,
                },
              ]);
              setForm((current) => ({ ...current, title: "", competition: "" }));
            }}
          >
            <input
              type="text"
              placeholder={t.titleLabel}
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              type="text"
              placeholder={t.competitionLabel}
              value={form.competition}
              onChange={(event) =>
                setForm((current) => ({ ...current, competition: event.target.value }))
              }
            />
            <div className={styles.adminFormRow}>
              <label>
                <span>{t.dateLabel}</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                />
              </label>
              <label>
                <span>{t.timeLabel}</span>
                <input
                  type="time"
                  value={form.time}
                  onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
                />
              </label>
            </div>
            <button type="submit" className={styles.adminPrimaryButton}>
              {t.addMatch}
            </button>
          </form>
          <div className={styles.adminScheduleBlock}>
            <strong>{t.scheduled}</strong>
            <div className={styles.adminList}>
              {scheduledMatches.map((match) => (
                <div key={match.id} className={styles.adminListItem}>
                  <div>
                    <strong>{match.title}</strong>
                    <p>{match.competition}</p>
                  </div>
                  <span className={styles.adminMeta}>
                    {match.date} · {match.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${styles.adminPanelCard} ${styles.adminPanelCardWide}`}>
          <div className={styles.adminCardTop}>
            <strong>{t.requests}</strong>
          </div>
          <div className={styles.adminRequestGrid}>
            {initialRequests.map((request) => (
              <div key={request.id} className={styles.adminRequestCard}>
                <strong>{request.club}</strong>
                <p>{request.service}</p>
                <span
                  className={`${styles.adminStatus} ${
                    request.status === "Pendiente" ? styles.adminStatusPending : styles.adminStatusOk
                  }`}
                >
                  {request.status === "Pendiente" ? t.pending : request.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
