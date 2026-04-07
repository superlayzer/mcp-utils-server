# mcp-utils-server

MCP server for everyday utility tools: word count, time, dates, dice, coins, and random numbers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

## What is this?

An [MCP](https://modelcontextprotocol.io) server that gives AI assistants access to everyday utility tools. No external APIs needed — all tools run locally with zero dependencies.

Works with any MCP client: [Layzer](https://layzer.ai), Claude Desktop, or your own application.

## Tools

| Tool | Description |
|------|-------------|
| `word_count` | Analyze text: word, character, sentence, and paragraph counts |
| `current_time` | Get the current date and time in any timezone |
| `days_between` | Calculate days between two dates |
| `roll_dice` | Roll dice using notation like 2d6, 1d20, 3d8+5 |
| `flip_coin` | Flip a coin |
| `random_number` | Generate a random integer in a range |

## Quick start

```bash
git clone https://github.com/superlayzer/mcp-utils-server.git
cd mcp-utils-server
npm install
npm run dev
```

Server runs at `http://localhost:3005/mcp`.

## Register in an MCP client

Add the server URL `http://localhost:3005/mcp` to any MCP-compatible client.

**Layzer:** Account > MCP Servers > Add Server

**Claude Desktop:** Add to `claude_desktop_config.json`:

```json
{ "mcpServers": { "utils": { "url": "http://localhost:3005/mcp" } } }
```

## Deploy to Cloudflare Workers

```bash
npx wrangler login
npm run deploy
```

Your server URL: `https://mcp-utils-server.<your-subdomain>.workers.dev/mcp`

## Example prompts

- "Count the words in this paragraph: ..."
- "What time is it in Tokyo?"
- "How many days between January 1 2024 and today?"
- "Roll 2d6"
- "Roll a d20"
- "Flip a coin"
- "Give me a random number between 1 and 1000"

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
