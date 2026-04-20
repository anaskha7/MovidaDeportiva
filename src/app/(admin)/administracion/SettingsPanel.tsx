"use client";

import { useActionState, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n-shared";
import {
  DEFAULT_PROFILE_AVATAR_URL,
  PROFILE_AVATAR_STORAGE_KEY,
  emitProfileAvatarUpdated,
  normalizeProfileAvatarUrl,
  sanitizeProfileAvatarUrl,
} from "@/lib/profile-avatar";
import type { Rol } from "@/lib/types";
import {
  type SettingsActionState,
  updatePasswordSettingsAction,
} from "@/app/app/ajustes/actions";
import styles from "./Administracion.module.css";

type SettingsPanelProps = {
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  role: Rol;
  roleLabel: string;
  language: Locale;
  subscriptionPlan?: string | null;
  subscriptionStatus?: string | null;
  onLanguageChange: (language: Locale) => void;
  onProfileUpdated: (input: {
    displayName: string;
    email: string;
    avatarUrl: string | null;
  }) => void;
};

const content = {
  es: {
    account: "Mi cuenta",
    accountDesc: "Gestiona tu información principal y los datos de acceso.",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    profile: "Perfil",
    club: "Club o entidad",
    security: "Seguridad",
    securityDesc: "Cambia tu contraseña y revisa el acceso a la cuenta.",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    save: "Guardar cambios",
    logout: "Cerrar sesión",
    notifications: "Notificaciones",
    notificationsDesc: "Elige qué avisos quieres recibir en tu cuenta.",
    importantEmails: "Correos importantes",
    importantEmailsDesc: "Reservas, accesos y cambios en tu cuenta.",
    liveAlerts: "Avisos de directos",
    liveAlertsDesc: "Recordatorios cuando arranca un partido o evento.",
    marketing: "Novedades y promociones",
    marketingDesc: "Información sobre servicios, mejoras y ofertas.",
    preferences: "Preferencias",
    preferencesDesc: "Ajusta cómo quieres usar la plataforma.",
    language: "Idioma",
    quality: "Calidad de reproducción por defecto",
    auto: "Automática",
    subscription: "Suscripción",
    subscriptionDesc: "Plan detectado según el acceso real de tu cuenta.",
    currentPlan: "Plan actual",
    access: "Acceso",
    manageSubscription: "Gestionar suscripción",
    subscribeNow: "Quiero suscribirme",
    goToAdmin: "Ir al panel admin",
    planBasic: "Plan básico",
    planSubscriber: "Plan suscriptor",
    planAdmin: "Acceso administrador",
    accessBasic: "Clasificaciones, calendario y área privada básica",
    accessSubscriber: "Contenido premium, VODs y directos",
    accessAdmin: "Acceso total a gestión, métricas y directos",
    deleteAccount: "Eliminar cuenta",
    deleteAccountDesc: "Borra tu acceso, tu perfil y los datos asociados que dependan de esta cuenta.",
    deleteAccountCta: "Borrar mi cuenta",
    deleteAccountConfirm: "Esta acción eliminará tu cuenta. ¿Quieres continuar?",
    deleteAccountSuccess: "Tu cuenta se ha eliminado correctamente.",
    deleteAccountError: "No se ha podido eliminar la cuenta.",
  },
  ca: {
    account: "El meu compte",
    accountDesc: "Gestiona la teva informació principal i les dades d'accés.",
    fullName: "Nom complet",
    email: "Correu electrònic",
    profile: "Perfil",
    club: "Club o entitat",
    security: "Seguretat",
    securityDesc: "Canvia la contrasenya i revisa l'accés al compte.",
    currentPassword: "Contrasenya actual",
    newPassword: "Nova contrasenya",
    confirmPassword: "Confirmar nova contrasenya",
    save: "Desar canvis",
    logout: "Tancar sessió",
    notifications: "Notificacions",
    notificationsDesc: "Tria quins avisos vols rebre al teu compte.",
    importantEmails: "Correus importants",
    importantEmailsDesc: "Reserves, accessos i canvis al teu compte.",
    liveAlerts: "Avisos de directes",
    liveAlertsDesc: "Recordatoris quan comença un partit o esdeveniment.",
    marketing: "Novetats i promocions",
    marketingDesc: "Informació sobre serveis, millores i ofertes.",
    preferences: "Preferències",
    preferencesDesc: "Ajusta com vols fer servir la plataforma.",
    language: "Idioma",
    quality: "Qualitat de reproducció per defecte",
    auto: "Automàtica",
    subscription: "Subscripció",
    subscriptionDesc: "Pla detectat segons l'accés real del teu compte.",
    currentPlan: "Pla actual",
    access: "Accés",
    manageSubscription: "Gestionar subscripció",
    subscribeNow: "Vull subscriure'm",
    goToAdmin: "Anar al panell admin",
    planBasic: "Pla bàsic",
    planSubscriber: "Pla subscriptor",
    planAdmin: "Accés administrador",
    accessBasic: "Classificacions, calendari i àrea privada bàsica",
    accessSubscriber: "Contingut premium, VODs i directes",
    accessAdmin: "Accés total a gestió, mètriques i directes",
    deleteAccount: "Eliminar compte",
    deleteAccountDesc: "Esborra el teu accés, el teu perfil i les dades associades que depenguin d'aquest compte.",
    deleteAccountCta: "Esborrar el meu compte",
    deleteAccountConfirm: "Aquesta acció eliminarà el teu compte. Vols continuar?",
    deleteAccountSuccess: "El teu compte s'ha eliminat correctament.",
    deleteAccountError: "No s'ha pogut eliminar el compte.",
  },
  en: {
    account: "My account",
    accountDesc: "Manage your main information and access details.",
    fullName: "Full name",
    email: "Email",
    profile: "Profile",
    club: "Club or organisation",
    security: "Security",
    securityDesc: "Change your password and review account access.",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    save: "Save changes",
    logout: "Log out",
    notifications: "Notifications",
    notificationsDesc: "Choose which alerts you want to receive.",
    importantEmails: "Important emails",
    importantEmailsDesc: "Bookings, access and account changes.",
    liveAlerts: "Live alerts",
    liveAlertsDesc: "Reminders when a match or event starts.",
    marketing: "News and promotions",
    marketingDesc: "Information about services, improvements and offers.",
    preferences: "Preferences",
    preferencesDesc: "Adjust how you want to use the platform.",
    language: "Language",
    quality: "Default playback quality",
    auto: "Automatic",
    subscription: "Subscription",
    subscriptionDesc: "Plan detected from your account's real access level.",
    currentPlan: "Current plan",
    access: "Access",
    manageSubscription: "Manage subscription",
    subscribeNow: "I want to subscribe",
    goToAdmin: "Go to admin panel",
    planBasic: "Basic plan",
    planSubscriber: "Subscriber plan",
    planAdmin: "Administrator access",
    accessBasic: "Standings, schedule and basic private area",
    accessSubscriber: "Premium content, VODs and live events",
    accessAdmin: "Full access to management, metrics and live operations",
    deleteAccount: "Delete account",
    deleteAccountDesc: "Remove your access, profile and dependent data linked to this account.",
    deleteAccountCta: "Delete my account",
    deleteAccountConfirm: "This action will delete your account. Do you want to continue?",
    deleteAccountSuccess: "Your account has been deleted successfully.",
    deleteAccountError: "The account could not be deleted.",
  },
} as const;

async function readFileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("No se pudo leer la imagen."));
        return;
      }

      resolve(result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

async function loadImageElement(src: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    image.src = src;
  });
}

async function readAvatarAsDataUrl(file: File) {
  const sourceDataUrl = await readFileAsDataUrl(file);

  try {
    const image = await loadImageElement(sourceDataUrl);
    const maxSize = 256;
    const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
    const targetWidth = Math.max(1, Math.round(image.width * ratio));
    const targetHeight = Math.max(1, Math.round(image.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      return sourceDataUrl;
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return sourceDataUrl;
  }
}

export default function SettingsPanel({
  displayName,
  email,
  avatarUrl: initialAvatarUrl,
  role,
  roleLabel,
  language,
  subscriptionPlan,
  subscriptionStatus,
  onLanguageChange,
  onProfileUpdated,
}: SettingsPanelProps) {
  const initialActionState: SettingsActionState = {
    status: "idle",
    message: null,
  };
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [liveNotifications, setLiveNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [defaultQuality, setDefaultQuality] = useState("1080p");
  const [avatarUrl, setAvatarUrl] = useState(
    normalizeProfileAvatarUrl(initialAvatarUrl),
  );
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [fullName, setFullName] = useState(displayName);
  const [profileState, setProfileState] = useState<SettingsActionState>(initialActionState);
  const [deleteState, setDeleteState] = useState<SettingsActionState>(initialActionState);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [passwordState, passwordAction] = useActionState(
    updatePasswordSettingsAction,
    initialActionState,
  );
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const t = content[language];
  const initials = useMemo(
    () =>
      fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(""),
    [fullName]
  );

  useEffect(() => {
    const persistedAvatar = sanitizeProfileAvatarUrl(initialAvatarUrl);

    if (persistedAvatar) {
      window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, persistedAvatar);
      setAvatarUrl(normalizeProfileAvatarUrl(persistedAvatar));
      return;
    }

    const savedAvatar = sanitizeProfileAvatarUrl(
      window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY),
    );

    if (savedAvatar) {
      setAvatarUrl(normalizeProfileAvatarUrl(savedAvatar));
      return;
    }

    window.localStorage.removeItem(PROFILE_AVATAR_STORAGE_KEY);
    setAvatarUrl(DEFAULT_PROFILE_AVATAR_URL);
  }, [initialAvatarUrl]);

  useEffect(() => {
    setFullName(displayName);
  }, [displayName]);

  useEffect(() => {
    if (passwordState.status === "success") {
      passwordFormRef.current?.reset();
    }
  }, [passwordState]);

  const persistProfile = async ({
    nextFullName,
    nextAvatarUrl,
  }: {
    nextFullName: string;
    nextAvatarUrl: string | null;
  }) => {
    if (isAvatarProcessing || isProfileSaving) {
      return false;
    }

    setIsProfileSaving(true);
    setProfileState(initialActionState);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: language,
          fullName: nextFullName,
          avatarUrl: nextAvatarUrl,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | (SettingsActionState & { updatedAvatarUrl?: string | null })
        | null;

      if (!response.ok || !result) {
        setProfileState({
          status: "error",
          message:
            result?.message ??
            (language === "en"
              ? "The profile could not be updated."
              : language === "ca"
                ? "No s'ha pogut actualitzar el perfil."
                : "No se ha podido actualizar el perfil."),
        });
        return false;
      }

      const persistedAvatarUrl = sanitizeProfileAvatarUrl(result.updatedAvatarUrl) ?? null;
      const persistedName = result.updatedName ?? nextFullName;

      setFullName(persistedName);
      setAvatarUrl(normalizeProfileAvatarUrl(persistedAvatarUrl));
      setProfileState({
        status: result.status ?? "success",
        message: result.message ?? null,
        updatedName: persistedName,
        updatedEmail: result.updatedEmail,
        updatedAvatarUrl: persistedAvatarUrl,
      });

      if (persistedAvatarUrl) {
        window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, persistedAvatarUrl);
        emitProfileAvatarUpdated(persistedAvatarUrl);
      } else {
        window.localStorage.removeItem(PROFILE_AVATAR_STORAGE_KEY);
        emitProfileAvatarUpdated(DEFAULT_PROFILE_AVATAR_URL);
      }

      onProfileUpdated({
        displayName: persistedName,
        email: result.updatedEmail ?? email,
        avatarUrl: persistedAvatarUrl,
      });
      return true;
    } catch {
      setProfileState({
        status: "error",
        message:
          language === "en"
            ? "The profile could not be updated."
            : language === "ca"
              ? "No s'ha pogut actualitzar el perfil."
              : "No se ha podido actualizar el perfil.",
      });
      return false;
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await persistProfile({
      nextFullName: fullName,
      nextAvatarUrl: sanitizeProfileAvatarUrl(avatarUrl),
    });
  };

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) {
      return;
    }

    if (!window.confirm(t.deleteAccountConfirm)) {
      return;
    }

    setDeleteState(initialActionState);
    setIsDeletingAccount(true);

    try {
      const response = await fetch(`/api/profile?locale=${language}`, {
        method: "DELETE",
      });

      const result = (await response.json().catch(() => null)) as SettingsActionState | null;

      if (!response.ok) {
        setDeleteState({
          status: "error",
          message: result?.message ?? t.deleteAccountError,
        });
        return;
      }

      setDeleteState({
        status: "success",
        message: result?.message ?? t.deleteAccountSuccess,
      });
      window.localStorage.removeItem(PROFILE_AVATAR_STORAGE_KEY);
      emitProfileAvatarUpdated(DEFAULT_PROFILE_AVATAR_URL);
      window.location.assign("/");
    } catch {
      setDeleteState({
        status: "error",
        message: t.deleteAccountError,
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const subscriptionDetails = useMemo(() => {
    if (subscriptionPlan) {
      return {
        badge: subscriptionPlan,
        access:
          subscriptionStatus && subscriptionStatus !== "activa"
            ? `${subscriptionStatus} · ${t.accessSubscriber}`
            : t.accessSubscriber,
        actionLabel: role === "admin" ? t.goToAdmin : t.manageSubscription,
        actionHref: role === "admin" ? "/dashboard" : "/servicios/contacto",
      };
    }

    if (role === "admin") {
      return {
        badge: t.planAdmin,
        access: t.accessAdmin,
        actionLabel: t.goToAdmin,
        actionHref: "/dashboard",
      };
    }

    if (role === "suscriptor") {
      return {
        badge: t.planSubscriber,
        access: t.accessSubscriber,
        actionLabel: t.manageSubscription,
        actionHref: "/servicios/contacto",
      };
    }

    return {
      badge: t.planBasic,
      access: t.accessBasic,
      actionLabel: t.subscribeNow,
      actionHref: "/servicios/contacto",
    };
  }, [
    role,
    subscriptionPlan,
    subscriptionStatus,
    t.accessAdmin,
    t.accessBasic,
    t.accessSubscriber,
    t.goToAdmin,
    t.manageSubscription,
    t.planAdmin,
    t.planBasic,
    t.planSubscriber,
    t.subscribeNow,
  ]);

  return (
    <div className={styles.settingsGrid}>
      <section className={styles.primaryColumn}>
        <form onSubmit={handleProfileSubmit} className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.account}</h2>
              <p>{t.accountDesc}</p>
            </div>
          </div>

          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>
            <div className={styles.avatarActions}>
              <strong>{fullName}</strong>
              <p>{roleLabel}</p>
              <label className={styles.avatarButton}>
                {language === "en"
                  ? "Change profile photo"
                  : language === "ca"
                    ? "Canviar foto de perfil"
                    : "Cambiar foto de perfil"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const optimizeAvatar = async () => {
                      const previousAvatarUrl = avatarUrl;

                      try {
                        setIsAvatarProcessing(true);
                        const dataUrl = await readAvatarAsDataUrl(file);
                        if (!dataUrl) return;
                        const normalizedAvatar = normalizeProfileAvatarUrl(dataUrl);
                        setAvatarUrl(normalizedAvatar);
                        const avatarSaved = await persistProfile({
                          nextFullName: fullName,
                          nextAvatarUrl: sanitizeProfileAvatarUrl(normalizedAvatar),
                        });

                        if (!avatarSaved) {
                          setAvatarUrl(previousAvatarUrl);
                        }
                      } finally {
                        setIsAvatarProcessing(false);
                        event.target.value = "";
                      }
                    };

                    void optimizeAvatar();
                  }}
                />
              </label>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t.fullName}</span>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>{t.email}</span>
              <input type="email" value={email} readOnly />
            </label>
            <label className={styles.field}>
              <span>{t.profile}</span>
              <input type="text" defaultValue={roleLabel} readOnly />
            </label>
            <label className={styles.field}>
              <span>{t.club}</span>
              <input type="text" defaultValue="Movida Deportiva TV" readOnly />
            </label>
          </div>
          <div className={styles.actionRow}>
            <button
              type="submit"
              className={styles.primaryAction}
              disabled={isAvatarProcessing || isProfileSaving}
            >
              {isProfileSaving
                ? "Guardando..."
                : isAvatarProcessing
                  ? "Procesando imagen..."
                  : t.save}
            </button>
          </div>
          <FormMessage state={profileState} />
        </form>

        <form ref={passwordFormRef} action={passwordAction} className={styles.settingsCard}>
          <input type="hidden" name="locale" value={language} />
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.security}</h2>
              <p>{t.securityDesc}</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t.currentPassword}</span>
              <input type="password" name="currentPassword" />
            </label>
            <label className={styles.field}>
              <span>{t.newPassword}</span>
              <input type="password" name="newPassword" />
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>{t.confirmPassword}</span>
              <input type="password" name="confirmPassword" />
            </label>
          </div>

          <div className={styles.actionRow}>
            <SubmitButton label={t.save} />
            <a href="/logout" className={styles.secondaryAction}>
              {t.logout}
            </a>
          </div>
          <FormMessage state={passwordState} />
        </form>
      </section>

      <aside className={styles.secondaryColumn}>
        <article className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.notifications}</h2>
              <p>{t.notificationsDesc}</p>
            </div>
          </div>

          <div className={styles.preferenceList}>
            <button
              type="button"
              className={styles.preferenceRow}
              onClick={() => setEmailNotifications((value) => !value)}
            >
              <div>
                <strong>{t.importantEmails}</strong>
                <p>{t.importantEmailsDesc}</p>
              </div>
              <span className={`${styles.switch} ${emailNotifications ? styles.switchActive : ""}`} />
            </button>

            <button
              type="button"
              className={styles.preferenceRow}
              onClick={() => setLiveNotifications((value) => !value)}
            >
              <div>
                <strong>{t.liveAlerts}</strong>
                <p>{t.liveAlertsDesc}</p>
              </div>
              <span className={`${styles.switch} ${liveNotifications ? styles.switchActive : ""}`} />
            </button>

            <button
              type="button"
              className={styles.preferenceRow}
              onClick={() => setMarketingNotifications((value) => !value)}
            >
              <div>
                <strong>{t.marketing}</strong>
                <p>{t.marketingDesc}</p>
              </div>
              <span className={`${styles.switch} ${marketingNotifications ? styles.switchActive : ""}`} />
            </button>
          </div>
        </article>

        <article className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.preferences}</h2>
              <p>{t.preferencesDesc}</p>
            </div>
          </div>

          <div className={styles.preferenceStack}>
            <label className={styles.field}>
              <span>{t.language}</span>
              <select
                value={language}
                onChange={(event) =>
                  onLanguageChange(event.target.value as Locale)
                }
              >
                <option value="es">Español</option>
                <option value="ca">Català</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>{t.quality}</span>
              <select
                value={defaultQuality}
                onChange={(event) => setDefaultQuality(event.target.value)}
              >
                <option>1080p</option>
                <option>720p</option>
                <option>{t.auto}</option>
              </select>
            </label>
          </div>
        </article>

        <article className={`${styles.settingsCard} ${styles.subscriptionCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.subscription}</h2>
              <p>{t.subscriptionDesc}</p>
            </div>
          </div>

          <div className={styles.planBadge}>{subscriptionDetails.badge}</div>
          <div className={styles.subscriptionInfo}>
            <div>
              <span>{t.currentPlan}</span>
              <strong>{subscriptionDetails.badge}</strong>
            </div>
            <div>
              <span>{t.access}</span>
              <strong>{subscriptionDetails.access}</strong>
            </div>
          </div>
          <a href={subscriptionDetails.actionHref} className={styles.primaryAction}>
            {subscriptionDetails.actionLabel}
          </a>
        </article>

        <article className={`${styles.settingsCard} ${styles.dangerCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.deleteAccount}</h2>
              <p>{t.deleteAccountDesc}</p>
            </div>
          </div>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.dangerAction}
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "..." : t.deleteAccountCta}
            </button>
          </div>
          <FormMessage state={deleteState} />
        </article>
      </aside>
    </div>
  );
}

function SubmitButton({
  label,
  disabled = false,
}: {
  label: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button type="submit" className={styles.primaryAction} disabled={isDisabled}>
      {pending ? "Guardando..." : disabled ? "Procesando imagen..." : label}
    </button>
  );
}

function FormMessage({
  state,
}: {
  state: {
    status: "idle" | "success" | "error";
    message: string | null;
  };
}) {
  if (!state.message || state.status === "idle") {
    return null;
  }

  return (
    <p
      className={`${styles.formMessage} ${
        state.status === "success" ? styles.formMessageSuccess : styles.formMessageError
      }`}
    >
      {state.message}
    </p>
  );
}
