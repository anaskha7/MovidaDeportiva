"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { NotificationFeedItem, AdminMetricSnapshot } from "@/lib/backoffice";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./Dashboard.module.css";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: string;
  blocked: boolean;
  joinedAt: string;
};

type RoleOption = {
  id: number;
  name: string;
  label: string;
};

type ServiceRequest = {
  id: number;
  userId: number | null;
  requester: string;
  email: string;
  services: string;
  date: string;
  hours: number;
  extras: string;
  details: string;
  total: number;
  status: string;
  createdAt: string;
};

type AdminDirect = {
  id: number;
  title: string;
  description: string;
  url: string;
  status: string;
  scheduledAt: string | null;
};

type AuditEntry = {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  description: string;
  actor: string;
  createdAt: string;
};

type AdminDashboardPanelProps = {
  locale: Locale;
  initialQuery?: string;
  users: AdminUser[];
  roles: RoleOption[];
  requests: ServiceRequest[];
  directs: AdminDirect[];
  logs: AuditEntry[];
  notifications: NotificationFeedItem[];
  metrics: AdminMetricSnapshot;
  onChangeUserRole: (formData: FormData) => Promise<void>;
  onToggleUserBlocked: (formData: FormData) => Promise<void>;
  onCreateDirect: (formData: FormData) => Promise<void>;
  onUpdateDirectStatus: (formData: FormData) => Promise<void>;
  onUpdateRequestStatus: (formData: FormData) => Promise<void>;
  onCreateNotification: (formData: FormData) => Promise<void>;
};

function buildFormData(entries: Record<string, string | number | null | undefined>) {
  const formData = new FormData();

  Object.entries(entries).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    formData.set(key, String(value));
  });

  return formData;
}

function formatCurrency(value: number, locale: Locale) {
  const currencyLocale = locale === "ca" ? "ca-ES" : locale === "en" ? "en-US" : "es-ES";
  return new Intl.NumberFormat(currencyLocale, {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function AdminDashboardPanel({
  locale,
  initialQuery = "",
  users,
  roles,
  requests,
  directs,
  logs,
  notifications,
  metrics,
  onChangeUserRole,
  onToggleUserBlocked,
  onCreateDirect,
  onUpdateDirectStatus,
  onUpdateRequestStatus,
  onCreateNotification,
}: AdminDashboardPanelProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const [roleDrafts, setRoleDrafts] = useState<Record<number, number>>(
    Object.fromEntries(users.map((user) => [user.id, user.roleId])),
  );
  const [requestStatusDrafts, setRequestStatusDrafts] = useState<Record<number, string>>(
    Object.fromEntries(requests.map((request) => [request.id, request.status])),
  );
  const [directStatusDrafts, setDirectStatusDrafts] = useState<Record<number, string>>(
    Object.fromEntries(directs.map((direct) => [direct.id, direct.status])),
  );
  const [directForm, setDirectForm] = useState({
    title: "",
    description: "",
    url: "",
    status: "programado",
    scheduledAt: "",
  });
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    target: "admin",
    type: "info",
    message: "",
  });

  const t = {
    es: {
      title: "Panel de control admin",
      subtitle: "Usuarios, solicitudes, directos, notificaciones y trazas ya salen de la base de datos.",
      users: "Gestión de usuarios",
      blocked: "Usuarios bloqueados",
      noBlocked: "No hay usuarios bloqueados",
      role: "Rol",
      joined: "Alta",
      saveRole: "Guardar rol",
      block: "Bloquear",
      unblock: "Desbloquear",
      requests: "Solicitudes de servicios",
      requestStatus: "Estado solicitud",
      requestsEmpty: "No hay solicitudes registradas todavía.",
      directs: "Gestión de directos",
      createDirect: "Crear directo",
      directTitle: "Nombre del directo",
      directDescription: "Descripción",
      directUrl: "URL de streaming",
      directStatus: "Estado",
      directDate: "Fecha programada",
      directsEmpty: "Todavía no hay directos registrados.",
      saveStatus: "Guardar estado",
      notifications: "Notificaciones reales",
      sendNotification: "Enviar notificación",
      notificationTitle: "Título",
      notificationTarget: "Destino",
      notificationType: "Tipo",
      notificationMessage: "Mensaje",
      notificationsEmpty: "Todavía no hay notificaciones en el sistema.",
      logs: "Logs básicos",
      logsEmpty: "Todavía no hay trazas registradas.",
      searchUsers: "Filtrar por nombre, email o servicio...",
      metrics: "Métricas reales",
      activeUsers: "Usuarios activos",
      blockedUsers: "Bloqueados",
      pendingRequests: "Pendientes",
      activeDirects: "En directo",
      scheduledDirects: "Programados",
      unreadNotifications: "Sin leer",
      general: "Toda la app",
      actorFallback: "Sistema",
    },
    ca: {
      title: "Panell de control admin",
      subtitle: "Usuaris, sol·licituds, directes, notificacions i traces ja surten de la base de dades.",
      users: "Gestió d'usuaris",
      blocked: "Usuaris bloquejats",
      noBlocked: "No hi ha usuaris bloquejats",
      role: "Rol",
      joined: "Alta",
      saveRole: "Desar rol",
      block: "Bloquejar",
      unblock: "Desbloquejar",
      requests: "Sol·licituds de serveis",
      requestStatus: "Estat de la sol·licitud",
      requestsEmpty: "Encara no hi ha sol·licituds registrades.",
      directs: "Gestió de directes",
      createDirect: "Crear directe",
      directTitle: "Nom del directe",
      directDescription: "Descripció",
      directUrl: "URL d'streaming",
      directStatus: "Estat",
      directDate: "Data programada",
      directsEmpty: "Encara no hi ha directes registrats.",
      saveStatus: "Desar estat",
      notifications: "Notificacions reals",
      sendNotification: "Enviar notificació",
      notificationTitle: "Títol",
      notificationTarget: "Destí",
      notificationType: "Tipus",
      notificationMessage: "Missatge",
      notificationsEmpty: "Encara no hi ha notificacions al sistema.",
      logs: "Logs bàsics",
      logsEmpty: "Encara no hi ha traces registrades.",
      searchUsers: "Filtra per nom, correu o servei...",
      metrics: "Mètriques reals",
      activeUsers: "Usuaris actius",
      blockedUsers: "Bloquejats",
      pendingRequests: "Pendents",
      activeDirects: "En directe",
      scheduledDirects: "Programats",
      unreadNotifications: "Sense llegir",
      general: "Tota l'app",
      actorFallback: "Sistema",
    },
    en: {
      title: "Admin control panel",
      subtitle: "Users, service requests, live broadcasts, notifications and logs now come from the database.",
      users: "User management",
      blocked: "Blocked users",
      noBlocked: "There are no blocked users",
      role: "Role",
      joined: "Joined",
      saveRole: "Save role",
      block: "Block",
      unblock: "Unblock",
      requests: "Service requests",
      requestStatus: "Request status",
      requestsEmpty: "There are no requests yet.",
      directs: "Live management",
      createDirect: "Create live item",
      directTitle: "Live title",
      directDescription: "Description",
      directUrl: "Streaming URL",
      directStatus: "Status",
      directDate: "Scheduled date",
      directsEmpty: "No live entries have been created yet.",
      saveStatus: "Save status",
      notifications: "Real notifications",
      sendNotification: "Send notification",
      notificationTitle: "Title",
      notificationTarget: "Target",
      notificationType: "Type",
      notificationMessage: "Message",
      notificationsEmpty: "There are no notifications yet.",
      logs: "Basic logs",
      logsEmpty: "There are no logs yet.",
      searchUsers: "Filter by name, email or service...",
      metrics: "Real metrics",
      activeUsers: "Active users",
      blockedUsers: "Blocked",
      pendingRequests: "Pending",
      activeDirects: "Live now",
      scheduledDirects: "Scheduled",
      unreadNotifications: "Unread",
      general: "Whole app",
      actorFallback: "System",
    },
  }[locale];

  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery = (value: string) =>
    !normalizedQuery || value.toLowerCase().includes(normalizedQuery);

  const filteredUsers = users.filter((user) =>
    matchesQuery(`${user.name} ${user.email} ${user.role}`),
  );
  const filteredBlockedUsers = filteredUsers.filter((user) => user.blocked);
  const filteredRequests = requests.filter((request) =>
    matchesQuery(`${request.requester} ${request.email} ${request.services} ${request.status}`),
  );
  const filteredDirects = directs.filter((direct) =>
    matchesQuery(`${direct.title} ${direct.description} ${direct.status}`),
  );
  const filteredNotifications = notifications.filter(
    (item: (typeof notifications)[number]) =>
      matchesQuery(`${item.title ?? ""} ${item.actor ?? ""} ${item.message}`),
  );
  const filteredLogs = logs.filter((log) =>
    matchesQuery(`${log.actor} ${log.entity} ${log.description}`),
  );

  const runServerAction = (action: () => Promise<void>, after?: () => void) => {
    startTransition(async () => {
      await action();
      after?.();
      router.refresh();
    });
  };

  return (
    <section className={styles.adminPanelSection}>
      <div className={styles.adminPanelHeader}>
        <div>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>
      </div>

      <div className={styles.adminCardTop}>
        <strong>{t.metrics}</strong>
        <input
          className={styles.adminSearch}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.searchUsers}
        />
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span>{t.activeUsers}</span>
          <strong>{metrics.activeUsers}</strong>
        </div>
        <div className={styles.metricCard}>
          <span>{t.blockedUsers}</span>
          <strong>{metrics.blockedUsers}</strong>
        </div>
        <div className={styles.metricCard}>
          <span>{t.pendingRequests}</span>
          <strong>{metrics.pendingRequests}</strong>
        </div>
        <div className={styles.metricCard}>
          <span>{t.activeDirects}</span>
          <strong>{metrics.activeDirects}</strong>
          <small>{t.scheduledDirects}: {metrics.scheduledDirects}</small>
        </div>
        <div className={styles.metricCard}>
          <span>{t.unreadNotifications}</span>
          <strong>{metrics.unreadNotifications}</strong>
          <small>{t.notifications}</small>
        </div>
      </div>

      <div className={styles.adminPanelGrid}>
        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.users}</strong>
          </div>
          <div className={styles.adminList}>
            {filteredUsers.map((user) => (
              <div key={user.id} className={styles.adminListItem}>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <p>
                    {t.joined}: {user.joinedAt}
                  </p>
                </div>
                <div className={styles.adminInlineActions}>
                  <select
                    className={styles.adminSelect}
                    value={roleDrafts[user.id] ?? user.roleId}
                    onChange={(event) =>
                      setRoleDrafts((current) => ({
                        ...current,
                        [user.id]: Number(event.target.value),
                      }))
                    }
                    disabled={isPending}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={styles.adminActionButton}
                    disabled={isPending || (roleDrafts[user.id] ?? user.roleId) === user.roleId}
                    onClick={() =>
                      runServerAction(() =>
                        onChangeUserRole(
                          buildFormData({
                            userId: user.id,
                            roleId: roleDrafts[user.id] ?? user.roleId,
                          }),
                        ),
                      )
                    }
                  >
                    {t.saveRole}
                  </button>
                  <button
                    type="button"
                    className={styles.adminActionButton}
                    disabled={isPending}
                    onClick={() =>
                      runServerAction(() =>
                        onToggleUserBlocked(
                          buildFormData({
                            userId: user.id,
                            blocked: (!user.blocked).toString(),
                          }),
                        ),
                      )
                    }
                  >
                    {user.blocked ? t.unblock : t.block}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.blocked}</strong>
          </div>
          {filteredBlockedUsers.length > 0 ? (
            <div className={styles.adminList}>
              {filteredBlockedUsers.map((user) => (
                <div key={user.id} className={styles.adminListItem}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.adminActionButton}
                    disabled={isPending}
                    onClick={() =>
                      runServerAction(() =>
                        onToggleUserBlocked(
                          buildFormData({
                            userId: user.id,
                            blocked: "false",
                          }),
                        ),
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
            <strong>{t.directs}</strong>
          </div>
          <form
            className={styles.adminForm}
            onSubmit={(event) => {
              event.preventDefault();
              runServerAction(
                () =>
                  onCreateDirect(
                    buildFormData({
                      title: directForm.title,
                      description: directForm.description,
                      url: directForm.url,
                      status: directForm.status,
                      scheduledAt: directForm.scheduledAt,
                    }),
                  ),
                () =>
                  setDirectForm({
                    title: "",
                    description: "",
                    url: "",
                    status: "programado",
                    scheduledAt: "",
                  }),
              );
            }}
          >
            <input
              type="text"
              value={directForm.title}
              placeholder={t.directTitle}
              onChange={(event) =>
                setDirectForm((current) => ({ ...current, title: event.target.value }))
              }
            />
            <input
              type="text"
              value={directForm.description}
              placeholder={t.directDescription}
              onChange={(event) =>
                setDirectForm((current) => ({ ...current, description: event.target.value }))
              }
            />
            <input
              type="url"
              value={directForm.url}
              placeholder={t.directUrl}
              onChange={(event) =>
                setDirectForm((current) => ({ ...current, url: event.target.value }))
              }
            />
            <div className={styles.adminFormRow}>
              <label>
                <span>{t.directDate}</span>
                <input
                  type="datetime-local"
                  value={directForm.scheduledAt}
                  onChange={(event) =>
                    setDirectForm((current) => ({ ...current, scheduledAt: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>{t.directStatus}</span>
                <select
                  className={styles.adminSelect}
                  value={directForm.status}
                  onChange={(event) =>
                    setDirectForm((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  <option value="programado">programado</option>
                  <option value="live">live</option>
                  <option value="finalizado">finalizado</option>
                </select>
              </label>
            </div>
            <button type="submit" className={styles.adminPrimaryButton} disabled={isPending}>
              {t.createDirect}
            </button>
          </form>
          {filteredDirects.length > 0 ? (
            <div className={styles.adminList}>
              {filteredDirects.map((direct) => (
                <div key={direct.id} className={styles.adminListItem}>
                  <div>
                    <strong>{direct.title}</strong>
                    <p>{direct.description || direct.url}</p>
                    <p>{direct.scheduledAt ?? "-"}</p>
                  </div>
                  <div className={styles.adminInlineActions}>
                    <select
                      className={styles.adminSelect}
                      value={directStatusDrafts[direct.id] ?? direct.status}
                      onChange={(event) =>
                        setDirectStatusDrafts((current) => ({
                          ...current,
                          [direct.id]: event.target.value,
                        }))
                      }
                    >
                      <option value="programado">programado</option>
                      <option value="live">live</option>
                      <option value="finalizado">finalizado</option>
                    </select>
                    <button
                      type="button"
                      className={styles.adminActionButton}
                      disabled={isPending || (directStatusDrafts[direct.id] ?? direct.status) === direct.status}
                      onClick={() =>
                        runServerAction(() =>
                          onUpdateDirectStatus(
                            buildFormData({
                              directId: direct.id,
                              status: directStatusDrafts[direct.id] ?? direct.status,
                            }),
                          ),
                        )
                      }
                    >
                      {t.saveStatus}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.adminEmpty}>{t.directsEmpty}</p>
          )}
        </article>

        <article className={styles.adminPanelCard}>
          <div className={styles.adminCardTop}>
            <strong>{t.notifications}</strong>
          </div>
          <form
            className={styles.adminForm}
            onSubmit={(event) => {
              event.preventDefault();
              runServerAction(
                () =>
                  onCreateNotification(
                    buildFormData({
                      title: notificationForm.title,
                      target: notificationForm.target,
                      type: notificationForm.type,
                      message: notificationForm.message,
                    }),
                  ),
                () =>
                  setNotificationForm({
                    title: "",
                    target: "admin",
                    type: "info",
                    message: "",
                  }),
              );
            }}
          >
            <input
              type="text"
              value={notificationForm.title}
              placeholder={t.notificationTitle}
              onChange={(event) =>
                setNotificationForm((current) => ({ ...current, title: event.target.value }))
              }
            />
            <div className={styles.adminFormRow}>
              <label>
                <span>{t.notificationTarget}</span>
                <select
                  className={styles.adminSelect}
                  value={notificationForm.target}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, target: event.target.value }))
                  }
                >
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                  <option value="suscriptor">suscriptor</option>
                  <option value="all">{t.general}</option>
                </select>
              </label>
              <label>
                <span>{t.notificationType}</span>
                <select
                  className={styles.adminSelect}
                  value={notificationForm.type}
                  onChange={(event) =>
                    setNotificationForm((current) => ({ ...current, type: event.target.value }))
                  }
                >
                  <option value="info">info</option>
                  <option value="success">success</option>
                  <option value="warning">warning</option>
                </select>
              </label>
            </div>
            <textarea
              className={styles.adminTextarea}
              rows={4}
              value={notificationForm.message}
              placeholder={t.notificationMessage}
              onChange={(event) =>
                setNotificationForm((current) => ({ ...current, message: event.target.value }))
              }
            />
            <button type="submit" className={styles.adminPrimaryButton} disabled={isPending}>
              {t.sendNotification}
            </button>
          </form>

          {filteredNotifications.length > 0 ? (
            <div className={styles.adminList}>
              {filteredNotifications.map((item: (typeof filteredNotifications)[number]) => (
                <div key={item.id} className={styles.adminListItem}>
                  <div>
                    <strong>{item.title || item.message}</strong>
                    <p>{item.actor || t.actorFallback}</p>
                    <p>{item.createdAtLabel}</p>
                  </div>
                  <span className={styles.adminMeta}>{item.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.adminEmpty}>{t.notificationsEmpty}</p>
          )}
        </article>

        <article className={`${styles.adminPanelCard} ${styles.adminPanelCardWide}`}>
          <div className={styles.adminCardTop}>
            <strong>{t.requests}</strong>
          </div>
          {filteredRequests.length > 0 ? (
            <div className={styles.adminRequestGrid}>
              {filteredRequests.map((request) => (
                <div key={request.id} className={styles.adminRequestCard}>
                  <strong>{request.requester}</strong>
                  <p>{request.email}</p>
                  <p>{request.services}</p>
                  <p>{request.date} · {request.hours}h</p>
                  {request.extras ? <p>{request.extras}</p> : null}
                  {request.details ? <p>{request.details}</p> : null}
                  <div className={styles.adminInlineActions}>
                    <select
                      className={styles.adminSelect}
                      value={requestStatusDrafts[request.id] ?? request.status}
                      onChange={(event) =>
                        setRequestStatusDrafts((current) => ({
                          ...current,
                          [request.id]: event.target.value,
                        }))
                      }
                    >
                      <option value="pendiente">pendiente</option>
                      <option value="revisando">revisando</option>
                      <option value="confirmada">confirmada</option>
                      <option value="rechazada">rechazada</option>
                      <option value="cerrada">cerrada</option>
                    </select>
                    <button
                      type="button"
                      className={styles.adminActionButton}
                      disabled={isPending || (requestStatusDrafts[request.id] ?? request.status) === request.status}
                      onClick={() =>
                        runServerAction(() =>
                          onUpdateRequestStatus(
                            buildFormData({
                              requestId: request.id,
                              status: requestStatusDrafts[request.id] ?? request.status,
                            }),
                          ),
                        )
                      }
                    >
                      {t.requestStatus}
                    </button>
                  </div>
                  <div className={styles.adminRequestFooter}>
                    <span>{request.createdAt}</span>
                    <strong>{formatCurrency(request.total, locale)}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.adminEmpty}>{t.requestsEmpty}</p>
          )}
        </article>

        <article className={`${styles.adminPanelCard} ${styles.adminPanelCardWide}`}>
          <div className={styles.adminCardTop}>
            <strong>{t.logs}</strong>
          </div>
          {filteredLogs.length > 0 ? (
            <div className={styles.adminList}>
              {filteredLogs.map((log) => (
                <div key={log.id} className={styles.adminListItem}>
                  <div>
                    <strong>{log.description}</strong>
                    <p>{log.actor}</p>
                  </div>
                  <span className={styles.adminMeta}>{log.createdAt}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.adminEmpty}>{t.logsEmpty}</p>
          )}
        </article>
      </div>
    </section>
  );
}
