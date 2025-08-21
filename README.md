# Next.js Docs MCP

A Model Context Protocol (MCP) server that provides access to Next.js documentation URLs without requiring AI or external API dependencies. This server contains a comprehensive database of Next.js documentation pages and allows you to search and retrieve relevant documentation URLs based on your needs.

## Key Features

- **AI-Free Documentation Access**: No AI dependencies - pure static URL database
- **Free Next.js Documentation**: Access latest Next.js docs without API costs
- **Comprehensive Coverage**: Contains URLs for getting started, routing, data fetching, API routes, deployment, and optimization
- **Multiple Search Methods**: Keyword search, topic-based search, and complete topic listings
- **npx-Ready**: No local installation needed - run via `npx` from any MCP client

## Requirements

- Node.js 18 or newer
- VS Code, Cursor, Windsurf, Claude Desktop, Goose, LM Studio, or any other MCP client

## Getting Started

### Installation

**Standard config** works in most tools:

```json
{
  "mcpServers": {
    "nextjs-docs-mcp": {
      "command": "npx",
      "args": ["@your-org/nextjs-docs-mcp@latest"]
    }
  }
}
```

[Install in VS Code](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22nextjs-docs-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40your-org%2Fnextjs-docs-mcp%40latest%22%5D%7D)  
[Install in VS Code Insiders](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22nextjs-docs-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40your-org%2Fnextjs-docs-mcp%40latest%22%5D%7D)

### Client-Specific Setup

<details>
<summary><b>Claude Code (Recommended)</b></summary>

Use the Claude Code CLI to add the MCP server:

```bash
claude mcp add nextjs-docs-mcp -- npx @your-org/nextjs-docs-mcp@latest
```

Remove if needed:
```bash
claude mcp remove nextjs-docs-mcp
```
</details>

<details>
<summary>Claude Desktop</summary>

Follow the MCP install guide and use the standard config above.

- Guide: https://modelcontextprotocol.io/quickstart/user
</details>

<details>
<summary>Cursor</summary>

Go to `Cursor Settings` → `MCP` → `Add new MCP Server`.

Use the following:
- Name: nextjs-docs-mcp
- Type: command
- Command: npx
- Args: @your-org/nextjs-docs-mcp@latest
- Auto start: on (optional)
</details>

<details>
<summary>VS Code</summary>

Add via CLI:

```bash
code --add-mcp '{"name":"nextjs-docs-mcp","command":"npx","args":["@your-org/nextjs-docs-mcp@latest"]}'
```

Or use the install links above.
</details>

<details>
<summary>LM Studio</summary>

Add MCP Server with:
- Command: npx
- Args: ["@your-org/nextjs-docs-mcp@latest"]
</details>

<details>
<summary>Goose</summary>

Advanced settings → Extensions → Add custom extension:
- Type: STDIO
- Command: npx
- Args: @your-org/nextjs-docs-mcp@latest
- Enabled: true
</details>

<details>
<summary>opencode</summary>

Example `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "nextjs-docs-mcp": {
      "type": "local",
      "command": [
        "npx",
        "@your-org/nextjs-docs-mcp@latest"
      ],
      "enabled": true
    }
  }
}
```
</details>

<details>
<summary>Qodo Gen</summary>

Open Qodo Gen → Connect more tools → + Add new MCP → Paste the standard config above → Save.
</details>

<details>
<summary>Windsurf</summary>

Follow Windsurf MCP documentation and use the standard config above.
- Docs: https://docs.windsurf.com/windsurf/cascade/mcp
</details>

## Available Tools

### 1. search_docs
Search Next.js documentation by keywords.

**Parameters:**
- `query` (required): Search keywords (e.g., 'routing', 'api', 'deployment')
- `limit` (optional): Maximum number of results to return (default: 5)

### 2. get_docs_by_topic
Get Next.js documentation URLs by specific topic.

**Parameters:**
- `topic` (required): Topic category
  - `getting-started`: Getting started guides
  - `routing`: App Router and Pages Router
  - `data-fetching`: Data fetching patterns
  - `api-routes`: API route handlers
  - `deployment`: Deployment guides
  - `optimization`: Performance optimization

### 3. list_all_topics
List all available documentation topics and their URLs.

## Usage Examples

### Search for routing documentation:
```json
{
  "tool": "search_docs",
  "arguments": {
    "query": "routing",
    "limit": 3
  }
}
```

### Get all deployment documentation:
```json
{
  "tool": "get_docs_by_topic",
  "arguments": {
    "topic": "deployment"
  }
}
```

### List all available topics:
```json
{
  "tool": "list_all_topics"
}
```

## Development

### Building the Package

```bash
npm run build
```

### Publishing to npm

1. Update the package name in `package.json` to your scope
2. Build the project: `npm run build`
3. Publish: `npm publish`

### Updating Documentation URLs

To update the documentation URLs, modify the `NEXTJS_DOCS_DATABASE` object in `src/index.ts`.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any improvements.
