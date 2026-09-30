export interface CsvSubscription {
  channelId: string;
  title: string;
}

export interface CsvImportResult {
  subscriptions: CsvSubscription[];
  skippedRows: number;
}

const CHANNEL_ID_PATTERN = /^UC[A-Za-z0-9_-]{22}$/;

function parseRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function normalizeHeader(value: string): string {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Takeout CSV에는 제어 문자(예: 0x08 백스페이스)가 섞여 나오는 경우가 있어
// 그대로 두면 채널명이 깨져 보인다 — 표시·검색 모두 안전하게 제거한다.
export function stripControlChars(value: string): string {
  // 제어 문자를 "의도적으로" 제거하는 정화 함수 — no-control-regex는 이 용례에 부적합
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function parseSubscriptionsCsv(text: string): CsvImportResult {
  const rows = parseRows(text).map((row) => row.map(stripControlChars));
  if (rows.length < 2) throw new Error("csv:empty");

  const headers = rows[0].map(normalizeHeader);
  const idIndex = headers.findIndex((header) =>
    ["채널 id", "channel id", "channelid"].includes(header)
  );
  const titleIndex = headers.findIndex((header) =>
    ["채널 제목", "channel title", "title"].includes(header)
  );

  if (idIndex === -1) throw new Error("csv:missingChannelId");

  const byId = new Map<string, CsvSubscription>();
  let skippedRows = 0;

  for (const row of rows.slice(1)) {
    const channelId = (row[idIndex] ?? "").trim();
    if (!CHANNEL_ID_PATTERN.test(channelId)) {
      skippedRows += 1;
      continue;
    }

    if (byId.has(channelId)) {
      skippedRows += 1;
      continue;
    }

    byId.set(channelId, {
      channelId,
      title: (titleIndex >= 0 ? row[titleIndex] : "")?.trim() || channelId,
    });
  }

  if (byId.size === 0) throw new Error("csv:noValidChannels");
  return { subscriptions: Array.from(byId.values()), skippedRows };
}

// CSV 필드 규칙 — 쉼표/따옴표/줄바꿈이 있으면 감싸고, 따옴표는 두 번 반복
function escapeCsvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

// 편집(추가/제거)을 마친 목록을 Takeout과 같은 형식의 CSV로 저장 —
// 저장한 파일은 다시 CSV 가져오기로 불러올 수 있다.
export function toSubscriptionsCsv(subscriptions: CsvSubscription[]): string {
  const lines = ["Channel Id,Channel Url,Channel Title"];
  for (const { channelId, title } of subscriptions) {
    const url = `https://www.youtube.com/channel/${channelId}`;
    lines.push([channelId, url, title || channelId].map(escapeCsvField).join(","));
  }
  return lines.join("\r\n");
}
