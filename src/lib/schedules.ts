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

      const timeLabel = middleTexts.find((text) => /\b\d{1,2}[:.]\d{2}\b|\b\d{1,2}\s*h\b/i.test(text));

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
    return parseSchedule(html, getMadridDateKey());
  } catch {
    return null;
  }
});
