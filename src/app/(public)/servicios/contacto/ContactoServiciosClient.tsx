"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./ContactoServicios.module.css";

export default function ContactoServiciosClient({
  locale,
  initialEmail = "",
  onSubmitInquiry,
}: {
  locale: Locale;
  initialEmail?: string;
  onSubmitInquiry: (input: {
    email: string;
    message: string;
  }) => Promise<{ ok: boolean; requestId: number }>;
}) {
  const copy = {
    es: {
      title: "Cuéntanos qué necesitas",
      subtitle:
        "Déjanos tu correo y una breve descripción de lo que quieres producir o retransmitir. Te responderemos con una propuesta.",
      email: "Correo electrónico",
      message: "Cuéntanos tu idea",
      placeholder:
        "Ejemplo: necesitamos cobertura en directo para un torneo de fin de semana, con realización, comentarista y piezas para redes.",
      hint: "Cuanto más contexto nos des, mejor podremos prepararte una propuesta.",
      submit: "Enviar solicitud",
      success: "Solicitud enviada correctamente. Ya ha quedado registrada para el equipo.",
      error: "No hemos podido enviar la solicitud. Revisa los datos e inténtalo de nuevo.",
    },
    ca: {
      title: "Explica'ns què necessites",
      subtitle:
        "Deixa'ns el teu correu i una breu descripció del que vols produir o retransmetre. Et respondrem amb una proposta.",
      email: "Correu electrònic",
      message: "Explica'ns la teva idea",
      placeholder:
        "Exemple: necessitem cobertura en directe per a un torneig de cap de setmana, amb realització, comentarista i peces per a xarxes.",
      hint: "Com més context ens donis, millor podrem preparar-te una proposta.",
      submit: "Enviar sol·licitud",
      success: "Sol·licitud enviada correctament. Ja ha quedat registrada per a l'equip.",
      error: "No hem pogut enviar la sol·licitud. Revisa les dades i torna-ho a provar.",
    },
    en: {
      title: "Tell us what you need",
      subtitle:
        "Leave your email and a short description of what you want to produce or broadcast. We will reply with a proposal.",
      email: "Email",
      message: "Tell us about your project",
      placeholder:
        "Example: we need live coverage for a weekend tournament, with production, commentary and social media clips.",
      hint: "The more context you share, the better we can shape the proposal.",
      submit: "Send request",
      success: "Request sent successfully. It has been registered for the team.",
      error: "We could not send the request. Check the details and try again.",
    },
  }[locale];

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setFeedback(null);

    startTransition(async () => {
      try {
        await onSubmitInquiry({
          email: email.trim(),
          message: message.trim(),
        });
        setMessage("");
        setFeedback({ kind: "success", text: copy.success });
      } catch {
        setFeedback({ kind: "error", text: copy.error });
      }
    });
  };

  return (
    <section className={styles.panel}>
      <div className={styles.intro}>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </div>

      <div className={styles.formCard}>
        <label className={styles.field}>
          <span>{copy.email}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@club.com"
          />
        </label>

        <label className={styles.field}>
          <span>{copy.message}</span>
          <textarea
            rows={7}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={copy.placeholder}
          />
        </label>

        <p className={styles.hint}>{copy.hint}</p>

        <button
          type="button"
          className={styles.submitButton}
          onClick={submit}
          disabled={isPending}
        >
          {copy.submit}
        </button>

        {feedback ? (
          <p
            className={`${styles.feedback} ${
              feedback.kind === "success" ? styles.feedbackSuccess : styles.feedbackError
            }`}
          >
            {feedback.text}
          </p>
        ) : null}
      </div>
    </section>
  );
}
