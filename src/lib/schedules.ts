import { cache } from "react";

export interface ScheduleMatch {
  homeTeam: string;
  awayTeam: string;
  timeLabel?: string;
}

export interface ScheduleRound {
  round: number;
  dateLabel: string;
  dateIso: string;
  matches: ScheduleMatch[];
}

export interface CompetitionSchedule {
  title?: string;
  rounds: ScheduleRound[];
}

const TIME_VALUE_PATTERN = /^(\d{1,2})[:.](\d{2})$/;
const TIME_HOUR_PATTERN = /^(\d{1,2})\s*h$/i;

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;|&#x27;/g, "'")
    .replace(/&eacute;/g, "é")
    .replace(/&Eacute;/g, "É")
    .replace(/&iacute;/g, "í")
    .replace(/&Iacute;/g, "Í")
    .replace(/&oacute;/g, "ó")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&ccedil;/g, "ç")
    .replace(/&Ccedil;/g, "Ç");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizeTeamName(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

function toNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toIsoDate(value: string) {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);

  if (!match) return null;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function getMadridDateKey() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return year && month && day ? `${year}-${month}-${day}` : "";
}

function normalizeTimeLabel(value?: string | null) {
  if (!value) return undefined;

  const trimmedValue = value.trim();
  const timeMatch = trimmedValue.match(TIME_VALUE_PATTERN);

  if (timeMatch) {
    const [, hours, minutes] = timeMatch;
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const hourMatch = trimmedValue.match(TIME_HOUR_PATTERN);

  if (hourMatch) {
    return `${hourMatch[1].padStart(2, "0")}:00`;
  }

  return undefined;
}

export function getScheduleMatchTimeLabel(value?: string | null) {
  return normalizeTimeLabel(value);
}

function parseSchedule(html: string, fromDateIso: string): CompetitionSchedule | null {
  const titleMatch = html.match(/<title>([^<]+)/i);
  const tableMatches = [...html.matchAll(/<table class="calendaritable">([\s\S]*?)<\/table>/gi)];

  const rounds = tableMatches.flatMap((tableMatch) => {
    const tableHtml = tableMatch[1];
    const headerMatch = tableHtml.match(
      /<th colspan="4">Jornada\s+(\d+)<\/th>\s*<th colspan="3">(\d{2}-\d{2}-\d{4})<\/th>/i,
    );

    if (!headerMatch) {
      return [];
    }

    const round = Number.parseInt(headerMatch[1], 10);
    const dateLabel = headerMatch[2];
    const dateIso = toIsoDate(dateLabel);

    if (!dateIso || dateIso < fromDateIso) {
      return [];
    }

    const rowMatches = [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)];

    const matches = rowMatches.flatMap((rowMatch) => {
      const rowHtml = rowMatch[1];
      const cellMatches = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];

      if (!cellMatches.length) {
        return [];
      }

      const cellTexts = cellMatches.map((cellMatch) => stripTags(cellMatch[1]));
      const teamNames = cellTexts.filter((text) => text && text !== "-" && !/^\d+$/.test(text));

      if (teamNames.length < 2) {
        return [];
      }

      const middleTexts = cellTexts
        .slice(1, -1)
        .map((text) => text.trim())
        .filter(Boolean);
      const isFinished = middleTexts.filter((text) => /^\d+$/.test(text)).length >= 2;

      if (isFinished) {
        return [];
      }

      const timeLabel = normalizeTimeLabel(
        middleTexts.find((text) => /\b\d{1,2}[:.]\d{2}\b|\b\d{1,2}\s*h\b/i.test(text)),
      );

      return [
        {
          homeTeam: normalizeTeamName(teamNames[0]),
          awayTeam: normalizeTeamName(teamNames[teamNames.length - 1]),
          timeLabel,
        } satisfies ScheduleMatch,
      ];
    });

    if (!matches.length) {
      return [];
    }

    return [{ round, dateLabel, dateIso, matches } satisfies ScheduleRound];
  });

  if (!rounds.length) {
    return null;
  }

  return {
    title: titleMatch ? stripTags(titleMatch[1]) : undefined,
    rounds,
  };
}

function parseResultadosFutbolSchedule(
  html: string,
  fromDateIso: string,
): CompetitionSchedule | null {
  const sectionMatches = [
    ...html.matchAll(
      /<div class="boxhome boxhome-2col" id="col-resultados">([\s\S]*?)<\/table>\s*<\/div>\s*<\/div>/gi,
    ),
  ];

  const rounds = sectionMatches.flatMap((sectionMatch) => {
    const sectionHtml = sectionMatch[1];
    const roundMatch = sectionHtml.match(/<span class="titlebox">Jornada\s+(\d+)<\/span>/i);
    const round = toNumber(roundMatch?.[1]);
    const rowMatches = [...sectionHtml.matchAll(/<tr[^>]*class="[^"]*vevent[^"]*"[\s\S]*?<\/tr>/gi)];

    const matches = rowMatches.flatMap((rowMatch) => {
      const rowHtml = rowMatch[0];
      const homeTeam = stripTags(
        rowHtml.match(/<td class="equipo1">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "",
      );
      const awayTeam = stripTags(
        rowHtml.match(/<td class="equipo2">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "",
      );
      const dtStart = rowHtml.match(/<span class="dtstart hidden" title="(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})"/i);
      const rawDateLabel = stripTags(
        rowHtml.match(/<td class="fecha">([\s\S]*?)<\/td>/i)?.[1] ?? "",
      );

      const dateIso = dtStart?.[1] ?? "";

      if (!homeTeam || !awayTeam || !dateIso || dateIso < fromDateIso) {
        return [];
      }

      const linkLabel = stripTags(
        rowHtml.match(/<a class="url"[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "",
      );
      const scoreLike = /^\d+\s*-\s*\d+$/.test(linkLabel) || /^\d+\-\d+$/.test(linkLabel);
      const timeLabel = !scoreLike ? normalizeTimeLabel(dtStart?.[2]?.slice(0, 5)) : undefined;

      return [{
        homeTeam: normalizeTeamName(homeTeam),
        awayTeam: normalizeTeamName(awayTeam),
        timeLabel,
        dateIso,
        rawDateLabel,
      }];
    });

    if (!round || !matches.length) {
      return [];
    }

    const dateIso = matches[0].dateIso;
    const dateLabel = matches[0].rawDateLabel || dateIso;

    return [{
      round,
      dateIso,
      dateLabel,
      matches: matches.map(({ homeTeam, awayTeam, timeLabel }) => ({
        homeTeam,
        awayTeam,
        timeLabel,
      })),
    } satisfies ScheduleRound];
  });

  if (!rounds.length) {
    return null;
  }

  rounds.sort((a, b) =>
    a.dateIso === b.dateIso ? a.round - b.round : a.dateIso.localeCompare(b.dateIso),
  );

  return {
    title: "Tercera Federación Grupo XII",
    rounds,
  };
}

export const getCompetitionSchedule = cache(async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    if (url.includes("resultados-futbol.com")) {
      return parseResultadosFutbolSchedule(html, getMadridDateKey());
    }

    return parseSchedule(html, getMadridDateKey());
  } catch {
    return null;
  }
});
