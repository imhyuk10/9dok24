import { describe, expect, it } from "vitest";
import { parseSubscriptionsCsv } from "./subscriptions-csv";

describe("parseSubscriptionsCsv", () => {
  it("parses a Korean Google Takeout subscription export", () => {
    const csv = [
      "\uFEFF채널 ID,채널 URL,채널 제목",
      'UC-QDfvrRIDB6F0bIO4I4HkQ,http://youtube.com/channel/UC-QDfvrRIDB6F0bIO4I4HkQ,"Pretty, Printed"',
    ].join("\r\n");

    expect(parseSubscriptionsCsv(csv)).toEqual({
      subscriptions: [
        { channelId: "UC-QDfvrRIDB6F0bIO4I4HkQ", title: "Pretty, Printed" },
      ],
      skippedRows: 0,
    });
  });

  it("deduplicates channel IDs and skips invalid rows", () => {
    const csv = [
      "Channel Id,Channel Title",
      "UC-QDfvrRIDB6F0bIO4I4HkQ,First",
      "UC-QDfvrRIDB6F0bIO4I4HkQ,Duplicate",
      "invalid-id,Invalid",
    ].join("\n");

    const result = parseSubscriptionsCsv(csv);
    expect(result.subscriptions).toHaveLength(1);
    expect(result.skippedRows).toBe(2);
  });

  it("rejects files without a channel ID column", () => {
    expect(() => parseSubscriptionsCsv("name,url\nA,https://example.com"))
      .toThrow("csv:missingChannelId");
  });
});
