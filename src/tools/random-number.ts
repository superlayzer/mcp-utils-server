import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerRandomNumber(server: McpServer): void {
  server.registerTool(
    "random_number",
    {
      title: "Random Number",
      description: "Generate a random integer between min and max (inclusive).",
      inputSchema: {
        min: z
          .number()
          .int()
          .default(0)
          .describe("Minimum value (inclusive, default 0)"),
        max: z
          .number()
          .int()
          .default(100)
          .describe("Maximum value (inclusive, default 100)"),
      },
    },
    async ({ min, max }) => {
      const lo = min ?? 0;
      const hi = max ?? 100;

      if (lo > hi) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `min (${lo}) must be less than or equal to max (${hi}).`,
            },
          ],
        };
      }

      const result = Math.floor(Math.random() * (hi - lo + 1)) + lo;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ result, min: lo, max: hi }),
          },
        ],
      };
    },
  );
}
