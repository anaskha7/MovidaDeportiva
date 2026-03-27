import { cache } from "react";

export interface StandingsRow {
  position: number;
  team: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor?: number;
  goalsAgainst?: number;
}

export interface StandingsTable {
  title?: string;
  updatedAt?: string;
  rows: StandingsRow[];
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

function toNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseStandings(html: string): StandingsTable | null {
  const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/i);

  if (!tbodyMatch) {
    return null;
  }

  const titleMatch = html.match(/<div class="d-n d-b_impr p-impr2 title">([\s\S]*?)<\/div>/i);
  const updatedMatch = html.match(/(?:Última actualització|Ultima actualitzacio):\s*([^<]+)/i);
  const rowMatches = tbodyMatch[1].match(/<tr>[\s\S]*?<\/tr>/g) ?? [];

  const rows = rowMatches.flatMap((rowHtml) => {
      const row = rowHtml.replace(/<!--[\s\S]*?-->/g, "");
      const positionCell = row.match(/<td[^>]*>([\s\S]*?)<\/td>/i)?.[1];
      const teamCell = row.match(/<td class="tl resumida">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>\s*<\/td>/i)?.[1];
      const visibleNumbers = [...row.matchAll(/<td class="tc">([\s\S]*?)<\/td>/g)]
        .map((match) => stripTags(match[1]))
        .filter(Boolean);
      const resumidaNumbers = [...row.matchAll(/<td class="tc resumida(?: p-r)?">([\s\S]*?)<\/td>/g)]
        .map((match) => stripTags(match[1]))
        .filter(Boolean);

      const position = toNumber(stripTags(positionCell ?? "").match(/\d+/)?.[0]);
      const team = stripTags(teamCell ?? "");
      const points = toNumber(visibleNumbers[0]);
      const goalsFor = toNumber(visibleNumbers[2]);
      const goalsAgainst = toNumber(visibleNumbers[3]);
      const played = toNumber(resumidaNumbers[0]);
      const won = toNumber(resumidaNumbers[1]);
      const drawn = toNumber(resumidaNumbers[2]);
      const lost = toNumber(resumidaNumbers[3]);

      if (
        !position ||
        !team ||
        points === undefined ||
        played === undefined ||
        won === undefined ||
        drawn === undefined ||
        lost === undefined
      ) {
        return [];
      }

      return [{
        position,
        team,
        points,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
      } satisfies StandingsRow];
    });

  if (!rows.length) {
    return null;
  }

  return {
    title: titleMatch ? stripTags(titleMatch[1]) : undefined,
    updatedAt: updatedMatch ? stripTags(updatedMatch[1]) : undefined,
    rows,
  };
}

export const getStandingsTable = cache(async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return parseStandings(html);
  } catch {
    return null;
  }
});
