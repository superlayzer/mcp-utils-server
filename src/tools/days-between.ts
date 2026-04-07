import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerDaysBetween(server: McpServer): void {
  server.registerTool(
    "days_between",
    {
      title: "Days Between Dates",
      description:
        "Calculate the number of days between two dates. Accepts formats like 2024-01-15 or January 15 2024.",
      inputSchema: {
        from: z.string().describe("Start date"),
        to: z.string().describe("End date"),
      },
    },
    async ({ from, to }) => {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime())) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Invalid start date: "${from}"`,
            },
          ],
        };
      }

      if (isNaN(toDate.getTime())) {
        return {
          isError: true,
          content: [
            { type: "text" as const, text: `Invalid end date: "${to}"` },
          ],
        };
      }

      const diffMs = Math.abs(toDate.getTime() - fromDate.getTime());
      const days = Math.floor(diffMs / 86_400_000);
      const direction = toDate >= fromDate ? "future" : "past";

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              days,
              weeks: Math.floor(days / 7),
              months: Math.round(days / 30.44),
              years: Math.floor(days / 365.25),
              direction,
              from: fromDate.toISOString().split("T")[0],
              to: toDate.toISOString().split("T")[0],
            }),
          },
        ],
      };
    },
  );
}
