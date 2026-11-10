import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import th from "../../messages/th.json";

function keys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object"
      ? keys(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

describe("messages", () => {
  it("th.json and en.json have the same keys", () => {
    expect(keys(en).sort()).toEqual(keys(th).sort());
  });

  it("has no empty strings", () => {
    for (const [name, messages] of Object.entries({ th, en })) {
      const empty = keys(messages).filter((path) => {
        const value = path
          .split(".")
          .reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], messages);
        return typeof value === "string" && value.trim() === "";
      });
      expect(empty, `${name}.json`).toEqual([]);
    }
  });
});
