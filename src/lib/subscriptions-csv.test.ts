import { describe, expect, it } from "vitest";
import { parseSubscriptionsCsv, toSubscriptionsCsv } from "./subscriptions-csv";

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

describe("toSubscriptionsCsv", () => {
  it("serializes with Takeout-compatible headers and channel URLs", () => {
    const csv = toSubscriptionsCsv([
      { channelId: "UC-QDfvrRIDB6F0bIO4I4HkQ", title: "Pretty Printed" },
    ]);

    expect(csv).toBe(
      "Channel Id,Channel Url,Channel Title\r\n" +
      "UC-QDfvrRIDB6F0bIO4I4HkQ,https://www.youtube.com/channel/UC-QDfvrRIDB6F0bIO4I4HkQ,Pretty Printed"
    );
  });

  it("quotes fields containing commas or quotes", () => {
    const csv = toSubscriptionsCsv([
      { channelId: "UC-QDfvrRIDB6F0bIO4I4HkQ", title: 'Pretty, "Printed"' },
    ]);
    const { subscriptions } = parseSubscriptionsCsv(csv);

    expect(subscriptions[0].title).toBe('Pretty, "Printed"');
  });

  it("round-trips a saved list back through the importer", () => {
    const original = [
      { channelId: "UC-QDfvrRIDB6F0bIO4I4HkQ", title: "Pretty, Printed" },
      { channelId: "UCuAXFkgcljR62qLX1sCJ9eQ", title: "짐보사" },
      { channelId: "UC0C-w0YjGpqDXGB8IHb662g", title: "" },
    ];
    const { subscriptions, skippedRows } = parseSubscriptionsCsv(toSubscriptionsCsv(original));

    expect(skippedRows).toBe(0);
    expect(subscriptions).toEqual([
      { channelId: "UC-QDfvrRIDB6F0bIO4I4HkQ", title: "Pretty, Printed" },
      { channelId: "UCuAXFkgcljR62qLX1sCJ9eQ", title: "짐보사" },
      { channelId: "UC0C-w0YjGpqDXGB8IHb662g", title: "UC0C-w0YjGpqDXGB8IHb662g" },
    ]);
  });
});
