"use client";

import { useMemo, useState } from "react";
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
  {
    id: "material",
    title: "Alquiler de material",
    pricePerHour: 14.99,
    description: "Equipamiento técnico para directos, entrevistas y cobertura de pista.",
    features: ["Cámaras y soportes", "Audio y microfonía", "Iluminación básica"],
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
}: {
  locale: Locale;
  initialQuery?: string;
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
      hint: "Solicitud interna preparada. El siguiente paso es revisión comercial y confirmación final.",
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
      hint: "Sol·licitud interna preparada. El següent pas és revisió comercial i confirmació final.",
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
      hint: "Internal request prepared. The next step is commercial review and final confirmation.",
      from: "from",
    },
  }[locale];

  const services = {
    es: SERVICES,
    ca: [
      { ...SERVICES[0], title: "Serveis retransmissió", description: "Cobertura audiovisual completa per a partits i esdeveniments esportius.", features: ["Realització en viu", "Marcadors i grafismes", "Lliurament de contingut final"] },
      { ...SERVICES[1], title: "Speakers i animació", description: "Locució, animació de graderia i dinamització de l'esdeveniment.", features: ["Speaker professional", "Guió de l'esdeveniment", "Coordinació de moments clau"] },
      { ...SERVICES[2], title: "Lloguer de material", description: "Equipament tècnic per a directes, entrevistes i cobertura de pista.", features: ["Càmeres i suports", "Àudio i microfonia", "Il·luminació bàsica"] },
    ],
    en: [
      { ...SERVICES[0], title: "Broadcast services", description: "Full audiovisual coverage for sports matches and events.", features: ["Live production", "Scoreboards and graphics", "Final content delivery"] },
      { ...SERVICES[1], title: "Speakers and entertainment", description: "Commentary, crowd entertainment and event hosting.", features: ["Professional speaker", "Event script", "Key moments coordination"] },
      { ...SERVICES[2], title: "Equipment rental", description: "Technical equipment for live shows, interviews and court coverage.", features: ["Cameras and supports", "Audio and microphones", "Basic lighting"] },
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
  const query = initialQuery.trim().toLowerCase();

  const visibleServices = services.filter((service) =>
    !query || `${service.title} ${service.description} ${service.features.join(" ")}`.toLowerCase().includes(query)
  );
  const visibleExtras = extraOptions.filter((extra) =>
    !query || extra.label.toLowerCase().includes(query)
  );

  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id));

  const extrasTotal = useMemo(
    () =>
      extraOptions.filter((extra) => extras.includes(extra.id)).reduce(
        (total, extra) => total + extra.price,
        0
      ),
    [extras]
  );

  const baseTotal = selectedServices.reduce(
    (total, service) => total + service.pricePerHour * hours,
    0
  );
  const total = baseTotal + extrasTotal;

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
              <input type="date" defaultValue="2026-03-20" />
            </label>
          </div>

          <label className={styles.field}>
            <span>{copy.details}</span>
            <textarea
              rows={4}
              defaultValue={copy.detailsValue}
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
          <button type="button" className={styles.confirmButton}>
            {copy.confirm}
          </button>
          <p className={styles.summaryHint}>
            {copy.hint}
          </p>
        </div>
      </aside>
    </div>
  );
}
