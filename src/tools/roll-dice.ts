import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const NOTATION_REGEX = /^(\d+)d(\d+)([+-]\d+)?$/i;

export function registerRollDice(server: McpServer): void {
  server.registerTool(
    "roll_dice",
    {
      title: "Roll Dice",
      description:
        "Roll dice using standard notation like 2d6, 1d20, 3d8+5. Or specify sides and count separately.",
      inputSchema: {
        notation: z
          .string()
          .optional()
          .describe("Dice notation e.g. 2d6, 1d20, 3d8+5"),
        sides: z
          .number()
          .int()
          .min(2)
          .max(1000)
          .optional()
          .describe("Number of sides (if not using notation)"),
        count: z
          .number()
          .int()
          .min(1)
          .max(100)
          .default(1)
          .describe("Number of dice (if not using notation)"),
      },
    },
    async ({ notation, sides, count }) => {
      let diceCount: number;
      let diceSides: number;
      let modifier = 0;
      let displayNotation: string;

      if (notation) {
        const match = NOTATION_REGEX.exec(notation);
        if (!match) {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `Invalid dice notation: "${notation}". Use format like 2d6, 1d20, 3d8+5.`,
              },
            ],
          };
        }
        diceCount = parseInt(match[1]!, 10);
        diceSides = parseInt(match[2]!, 10);
        modifier = match[3] ? parseInt(match[3], 10) : 0;
        displayNotation = notation;
      } else if (sides) {
        diceCount = count ?? 1;
        diceSides = sides;
        displayNotation = `${diceCount}d${diceSides}`;
      } else {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: "Provide either notation (e.g. 2d6) or sides (e.g. 6).",
            },
          ],
        };
      }

      if (diceCount > 100) {
        return {
          isError: true,
          content: [
            { type: "text" as const, text: "Maximum 100 dice at a time." },
          ],
        };
      }

      const rolls = Array.from(
        { length: diceCount },
        () => Math.floor(Math.random() * diceSides) + 1,
      );
      const subtotal = rolls.reduce((a, b) => a + b, 0);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              notation: displayNotation,
              rolls,
              modifier,
              subtotal,
              total: subtotal + modifier,
            }),
          },
        ],
      };
    },
  );
}
