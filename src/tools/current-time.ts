import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerCurrentTime(server: McpServer): void {
  server.registerTool(
    "current_time",
    {
      title: "Current Time",
      description:
        "Get the current date and time in any timezone. Use IANA timezone names like America/New_York, Europe/London, Asia/Tokyo.",
      inputSchema: {
        timezone: z
          .string()
          .default("UTC")
          .describe("IANA timezone name (default: UTC)"),
      },
    },
    async ({ timezone }) => {
      try {
        const tz = timezone ?? "UTC";
        const now = new Date();

        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);

        const dateParts = new Intl.DateTimeFormat("en-CA", {
          timeZone: tz,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now);

        const timeParts = new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

        const offsetMinutes = getTimezoneOffset(now, tz);
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes <= 0 ? "+" : "-";
        const offset = `UTC${offsetSign}${offsetHours}${offsetMins > 0 ? `:${String(offsetMins).padStart(2, "0")}` : ""}`;

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                formatted,
                date: dateParts,
                time: timeParts,
                timezone: tz,
                offset,
                unix: Math.floor(now.getTime() / 1000),
              }),
            },
          ],
        };
      } catch {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Invalid timezone: "${timezone}". Use IANA names like America/New_York, Europe/London, Asia/Tokyo.`,
            },
          ],
        };
      }
    },
  );
}

function getTimezoneOffset(date: Date, timeZone: string): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = date.toLocaleString("en-US", { timeZone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (utcDate.getTime() - tzDate.getTime()) / 60_000;
}
