"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./ServiciosPrivados.module.css";

type ServiceOption = {
  id: string;
  title: string;
  pricePerHour: number;
  description: string;
  features: string[];
};

const SERVICES: ServiceOption[] = [
  {
    id: "retransmision",
    title: "Servicios retransmisión",
    pricePerHour: 19.99,
    description: "Cobertura audiovisual completa para partidos y eventos deportivos.",
    features: ["Realización en vivo", "Marcadores y grafismos", "Entrega de contenido final"],
  },
  {
    id: "speakers",
    title: "Speakers y animación",
    pricePerHour: 27.99,
    description: "Locución, animación de grada y dinamización del evento.",
    features: ["Speaker profesional", "Guion del evento", "Coordinación de momentos clave"],
  },
];

const EXTRA_OPTIONS = [
  { id: "zona-mixta", label: "Zona mixta y entrevistas", price: 49 },
  { id: "social-media", label: "Clips para redes sociales", price: 35 },
  { id: "estadisticas", label: "Grafismos y estadísticas", price: 25 },
];

export default function ContratarServiciosClient({
  locale,
  initialQuery = "",
  initialName = "",
  initialEmail = "",
  onSubmitRequest,
}: {
  locale: Locale;
  initialQuery?: string;
  initialName?: string;
  initialEmail?: string;
  onSubmitRequest: (input: {
    name: string;
    email: string;
    services: string[];
    hours: number;
    date: string;
    details?: string;
    extras: string[];
    total: number;
  }) => Promise<{ ok: boolean; requestId: number }>;
}) {
  const copy = {
    es: {
      title: "Contratar servicios",
      subtitle: "Escoge el servicio, ajusta horas y prepara una reserva rápida.",
      serviceHours: "Horas de servicio",
      date: "Fecha prevista",
      details: "Detalles del evento",
      detailsValue: "Partido en pabellón, con narración y emisión en directo.",
      extras: "Extras disponibles",
      summary: "Resumen",
      selected: "Servicios seleccionados",
      includes: "Incluye",
      extrasLabel: "Extras",
      total: "Total estimado",
      confirm: "Confirmar solicitud",
      hint: "La solicitud se registrará en la base de datos y pasará al panel admin.",
      success: "Solicitud enviada correctamente. Ya aparece en el panel admin.",
      error: "No se ha podido registrar la solicitud. Revisa los datos e inténtalo otra vez.",
      contactName: "Nombre de contacto",
      contactEmail: "Correo de contacto",
      from: "desde",
    },
    ca: {
      title: "Contractar serveis",
      subtitle: "Escull el servei, ajusta hores i prepara una reserva ràpida.",
      serviceHours: "Hores de servei",
      date: "Data prevista",
      details: "Detalls de l'esdeveniment",
      detailsValue: "Partit en pavelló, amb narració i emissió en directe.",
      extras: "Extres disponibles",
      summary: "Resum",
      selected: "Serveis seleccionats",
      includes: "Inclou",
      extrasLabel: "Extres",
      total: "Total estimat",
      confirm: "Confirmar sol·licitud",
      hint: "La sol·licitud es registrarà a la base de dades i passarà al panell admin.",
      success: "Sol·licitud enviada correctament. Ja apareix al panell admin.",
      error: "No s'ha pogut registrar la sol·licitud. Revisa les dades i torna-ho a provar.",
      contactName: "Nom de contacte",
      contactEmail: "Correu de contacte",
      from: "des de",
    },
    en: {
      title: "Hire services",
      subtitle: "Choose the service, adjust the hours and prepare a quick booking.",
      serviceHours: "Service hours",
      date: "Expected date",
      details: "Event details",
      detailsValue: "Indoor match, with commentary and live broadcast.",
      extras: "Available extras",
      summary: "Summary",
      selected: "Selected services",
      includes: "Includes",
      extrasLabel: "Extras",
      total: "Estimated total",
      confirm: "Confirm request",
      hint: "The request will be stored in the database and moved to the admin panel.",
      success: "Request sent successfully. It is now visible in the admin panel.",
      error: "The request could not be saved. Check the details and try again.",
      contactName: "Contact name",
      contactEmail: "Contact email",
      from: "from",
    },
  }[locale];

  const services = {
    es: SERVICES,
    ca: [
      { ...SERVICES[0], title: "Serveis retransmissió", description: "Cobertura audiovisual completa per a partits i esdeveniments esportius.", features: ["Realització en viu", "Marcadors i grafismes", "Lliurament de contingut final"] },
      { ...SERVICES[1], title: "Speakers i animació", description: "Locució, animació de graderia i dinamització de l'esdeveniment.", features: ["Speaker professional", "Guió de l'esdeveniment", "Coordinació de moments clau"] },
    ],
    en: [
      { ...SERVICES[0], title: "Broadcast services", description: "Full audiovisual coverage for sports matches and events.", features: ["Live production", "Scoreboards and graphics", "Final content delivery"] },
      { ...SERVICES[1], title: "Speakers and entertainment", description: "Commentary, crowd entertainment and event hosting.", features: ["Professional speaker", "Event script", "Key moments coordination"] },
    ],
  }[locale];

  const extraOptions = {
    es: EXTRA_OPTIONS,
    ca: [
      { id: "zona-mixta", label: "Zona mixta i entrevistes", price: 49 },
      { id: "social-media", label: "Clips per a xarxes socials", price: 35 },
      { id: "estadisticas", label: "Grafismes i estadístiques", price: 25 },
    ],
    en: [
      { id: "zona-mixta", label: "Mixed zone and interviews", price: 49 },
      { id: "social-media", label: "Social media clips", price: 35 },
      { id: "estadisticas", label: "Graphics and statistics", price: 25 },
    ],
  }[locale];

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([services[0].id]);
  const [hours, setHours] = useState(2);
  const [extras, setExtras] = useState<string[]>([]);
  const [contactName, setContactName] = useState(initialName);
  const [contactEmail, setContactEmail] = useState(initialEmail);
  const [plannedDate, setPlannedDate] = useState("2026-03-29");
  const [details, setDetails] = useState(copy.detailsValue);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const query = initialQuery.trim().toLowerCase();

  const visibleServices = services.filter((service) =>
    !query || `${service.title} ${service.description} ${service.features.join(" ")}`.toLowerCase().includes(query)
  );
  const visibleExtras = extraOptions.filter((extra) =>
    !query || extra.label.toLowerCase().includes(query)
  );

  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id));

  const extrasTotal = extraOptions
    .filter((extra) => extras.includes(extra.id))
    .reduce((total, extra) => total + extra.price, 0);

  const baseTotal = selectedServices.reduce(
    (total, service) => total + service.pricePerHour * hours,
    0
  );
  const total = baseTotal + extrasTotal;

  const submitRequest = () => {
    setFeedback(null);

    startTransition(async () => {
      try {
        await onSubmitRequest({
          name: contactName.trim(),
          email: contactEmail.trim(),
          services: selectedServices.map((service) => service.title),
          hours,
          date: plannedDate,
          details,
          extras: extraOptions
            .filter((extra) => extras.includes(extra.id))
            .map((extra) => extra.label),
          total,
        });
        setFeedback({ kind: "success", text: copy.success });
      } catch {
        setFeedback({ kind: "error", text: copy.error });
      }
    });
  };

  return (
    <div className={styles.bookingGrid}>
      <section className={styles.bookingPanel}>
        <div className={styles.sectionHeading}>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>

        <div className={styles.serviceGrid}>
          {visibleServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() =>
                setSelectedServiceIds((current) =>
                  current.includes(service.id)
                    ? current.length === 1
                      ? current
                      : current.filter((item) => item !== service.id)
                    : [...current, service.id]
                )
              }
              className={`${styles.serviceCard} ${selectedServiceIds.includes(service.id) ? styles.serviceCardActive : ""}`}
            >
              <div>
                <strong>{service.title}</strong>
                <p>{service.description}</p>
              </div>
              <span>{copy.from} {service.pricePerHour.toFixed(2)}€/h</span>
            </button>
          ))}
        </div>

        <div className={styles.formCard}>
          <div className={styles.formRow}>
            <label className={styles.field}>
              <span>{copy.contactName}</span>
              <input
                type="text"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>{copy.contactEmail}</span>
              <input
                type="email"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.field}>
              <span>{copy.serviceHours}</span>
              <input
                type="number"
                min={1}
                max={24}
                value={hours}
                onChange={(event) => setHours(Math.max(1, Number(event.target.value) || 1))}
              />
            </label>
            <label className={styles.field}>
              <span>{copy.date}</span>
              <input type="date" value={plannedDate} onChange={(event) => setPlannedDate(event.target.value)} />
            </label>
          </div>

          <label className={styles.field}>
            <span>{copy.details}</span>
            <textarea
              rows={4}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
            />
          </label>

          <div className={styles.extraSection}>
            <span className={styles.extraLabel}>{copy.extras}</span>
            <div className={styles.extraList}>
              {visibleExtras.map((extra) => {
                const active = extras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() =>
                      setExtras((current) =>
                        active
                          ? current.filter((item) => item !== extra.id)
                          : [...current, extra.id]
                      )
                    }
                    className={`${styles.extraButton} ${active ? styles.extraButtonActive : ""}`}
                  >
                    <span>{extra.label}</span>
                    <strong>+{extra.price}€</strong>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {visibleServices.length === 0 && visibleExtras.length === 0 ? (
          <div className={styles.summaryHint}>{locale === "en" ? "No results found for this search." : locale === "ca" ? "No s'han trobat resultats per a aquesta cerca." : "No se han encontrado resultados para esta búsqueda."}</div>
        ) : null}
      </section>

      <aside className={styles.summaryPanel}>
        <div className={styles.summaryCard}>
          <h2>{copy.summary}</h2>
          <div className={styles.summaryBlock}>
            <span>{copy.selected}</span>
            <div className={styles.selectedServices}>
              {selectedServices.map((service) => (
                <strong key={service.id}>{service.title}</strong>
              ))}
            </div>
          </div>
          <div className={styles.summaryBlock}>
            <span>{copy.includes}</span>
            <ul className={styles.featureList}>
              {Array.from(new Set(selectedServices.flatMap((service) => service.features))).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          {selectedServices.map((service) => (
            <div key={service.id} className={styles.summaryLine}>
              <span>
                {service.title} · {hours} h x {service.pricePerHour.toFixed(2)}€
              </span>
              <strong>{(service.pricePerHour * hours).toFixed(2)}€</strong>
            </div>
          ))}
          <div className={styles.summaryLine}>
            <span>{copy.extrasLabel}</span>
            <strong>{extrasTotal.toFixed(2)}€</strong>
          </div>
          <div className={styles.totalLine}>
            <span>{copy.total}</span>
            <strong>{total.toFixed(2)}€</strong>
          </div>
          <button
            type="button"
            className={styles.confirmButton}
            disabled={
              isPending ||
              selectedServices.length === 0 ||
              !contactName.trim() ||
              !contactEmail.trim() ||
              !plannedDate
            }
            onClick={submitRequest}
          >
            {copy.confirm}
          </button>
          <p className={styles.summaryHint}>
            {copy.hint}
          </p>
          {feedback ? (
            <p
              className={styles.summaryHint}
              style={{ color: feedback.kind === "success" ? "#14613b" : "#8b2b2b" }}
            >
              {feedback.text}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
