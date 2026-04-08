import { Hono } from "hono";
import { cors } from "hono/cors";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerWordCount } from "./tools/word-count.js";
import { registerCurrentTime } from "./tools/current-time.js";
import { registerDaysBetween } from "./tools/days-between.js";
import { registerRollDice } from "./tools/roll-dice.js";
import { registerFlipCoin } from "./tools/flip-coin.js";
import { registerRandomNumber } from "./tools/random-number.js";

function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "mcp-utils-server", version: "1.0.0" },
    { capabilities: { logging: {} } },
  );

  registerWordCount(server);
  registerCurrentTime(server);
  registerDaysBetween(server);
  registerRollDice(server);
  registerFlipCoin(server);
  registerRandomNumber(server);

  return server;
}

type Bindings = {
  MCP_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "mcp-session-id",
      "Last-Event-ID",
      "mcp-protocol-version",
    ],
    exposeHeaders: ["mcp-session-id", "mcp-protocol-version"],
  }),
);

app.get("/", (c) => c.json({ name: "mcp-utils-server", version: "1.0.0" }));

// Optional API key authentication.
// Set MCP_API_KEY env var to require Bearer token auth.
// If not set, the server is open access.
app.use("/mcp", async (c, next) => {
  const apiKey = c.env.MCP_API_KEY ?? process.env.MCP_API_KEY;
  if (!apiKey) return next();

  const auth = c.req.header("Authorization");
  if (auth !== `Bearer ${apiKey}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
});

app.all("/mcp", async (c) => {
  const { req, res } = toReqRes(c.req.raw);
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(
    req,
    res,
    await c.req.json().catch(() => undefined),
  );
  return toFetchResponse(res);
});

export default app;
