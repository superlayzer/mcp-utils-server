import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerFlipCoin(server: McpServer): void {
  server.registerTool(
    "flip_coin",
    {
      title: "Flip a Coin",
      description: "Flip a coin and get heads or tails.",
      inputSchema: {},
    },
    async () => {
      const result = Math.random() < 0.5 ? "heads" : "tails";
      const message =
        result === "heads" ? "The coin lands on heads!" : "Tails it is!";

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ result, message }),
          },
        ],
      };
    },
  );
}
