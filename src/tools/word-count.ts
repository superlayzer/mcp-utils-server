import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerWordCount(server: McpServer): void {
  server.registerTool(
    "word_count",
    {
      title: "Word Count",
      description:
        "Analyze text and return word count, character count, sentence count and paragraph count.",
      inputSchema: {
        text: z.string().describe("Text to analyze"),
      },
    },
    async ({ text }) => {
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s/g, "").length;
      const sentenceCount = text
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0).length;
      const paragraphCount = text
        .split(/\n\n+/)
        .filter((p) => p.trim().length > 0).length;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              wordCount,
              charCount,
              charCountNoSpaces,
              sentenceCount,
              paragraphCount,
            }),
          },
        ],
      };
    },
  );
}
