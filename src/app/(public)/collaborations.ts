import type { Locale } from "@/lib/i18n-shared";

export const PUBLIC_COLLABORATORS = [
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Sant_Quirze-removebg-preview.png",
    alt: "Sant Quirze",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Federacion_Catalana_Futbol_Sala_Logo1-removebg-preview.png",
    alt: "Federacion Catalana Futbol Sala",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Federacion_Tinerfena_Futbol_Logo1-removebg-preview.png",
    alt: "Federacion Tinerfena Futbol",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Federacion_Tinerfena_Futbol_Logo2-removebg-preview.png",
    alt: "Federacion Tinerfena Futbol alternativa",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Patrocinador_Logo_Global5Management-removebg-preview.png",
    alt: "Global 5 Management",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/UD_Anaza-removebg-preview.png",
    alt: "UD Anaza",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Tenerife/CD_Sobradillo.webp",
    alt: "CD Sobradillo",
  },
  {
    src: "/assets/figma/Logos%20-%20Federaciones%20-%20Equipos/Tenerife/Real_Union.png",
    alt: "Real Union",
  },
] as const;

export function getCollaborationsLabel(locale: Locale) {
  if (locale === "ca") {
    return "Col·laboracions";
  }

  if (locale === "en") {
    return "Collaborations";
  }

  return "Colaboraciones";
}
