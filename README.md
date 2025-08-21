# Next.js Docs MCP

A Model Context Protocol (MCP) server that provides all Next.js documentation URLs to AI agents like Claude for intelligent document selection. This server contains a comprehensive static database of Next.js documentation pages and enables AI agents to analyze and select the most relevant documentation based on user queries.

## Key Features

- **AI Agent Integration**: Provides all documentation URLs for Claude and other AI agents to analyze and select relevant docs
- **Comprehensive Static Database**: Contains 200+ Next.js documentation URLs across all categories
- **No External Dependencies**: Pure static URL database with no API calls or crawling required
- **Claude-Optimized**: Specifically designed for Claude to intelligently select relevant documentation
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
      "args": ["@taiyokimura/nextjs-docs-mcp@latest"]
    }
  }
}
```

[Install in VS Code](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22nextjs-docs-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40nanameru%2Fnextjs-docs-mcp%40latest%22%5D%7D)
[Install in VS Code Insiders](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22nextjs-docs-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40nanameru%2Fnextjs-docs-mcp%40latest%22%5D%7D)

### Client-Specific Setup

<details>
<summary><b>Claude Code (Recommended)</b></summary>

Use the Claude Code CLI to add the MCP server:

```bash
claude mcp add nextjs-docs-mcp -- npx @taiyokimura/nextjs-docs-mcp@latest
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
- Args: @taiyokimura/nextjs-docs-mcp@latest
- Auto start: on (optional)
</details>

<details>
<summary>VS Code</summary>

Add via CLI:

```bash
code --add-mcp '{"name":"nextjs-docs-mcp","command":"npx","args":["@taiyokimura/nextjs-docs-mcp@latest"]}'
```

Or use the install links above.
</details>

<details>
<summary>LM Studio</summary>

Add MCP Server with:
- Command: npx
- Args: ["@taiyokimura/nextjs-docs-mcp@latest"]
</details>

<details>
<summary>Goose</summary>

Advanced settings → Extensions → Add custom extension:
- Type: STDIO
- Command: npx
- Args: @taiyokimura/nextjs-docs-mcp@latest
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
        "@taiyokimura/nextjs-docs-mcp@latest"
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

### 1. get_all_docs
Get all Next.js documentation URLs for AI agents to analyze and select relevant ones.

**Parameters:**
- None required

**Description:**
This tool returns a comprehensive list of all Next.js documentation URLs organized by categories. AI agents like Claude can use this list to analyze user queries and select the most relevant documentation pages. The tool provides structured data including titles, URLs, descriptions, and categories for intelligent document selection.

**Response Format:**
The tool returns a formatted list containing:
- Document titles
- Direct URLs to Next.js documentation
- Brief descriptions
- Category classifications
- Total count of available documents

## Usage Examples

### Get all Next.js documentation URLs:
```json
{
  "tool": "get_all_docs"
}
```

### Claude Integration Example:
1. User asks: "Next.jsのエラーを解消したいです"
2. Claude calls: `get_all_docs`
3. MCP server returns: All 200+ Next.js documentation URLs with titles, descriptions, and categories
4. Claude analyzes the list and selects relevant documents:
   - "Getting Started: Error Handling"
   - "Routing: Error Handling"
   - "API Routes Error Handling"
5. Claude provides targeted documentation links to the user

### Integration with Claude Code:
```bash
# Claude Code内で使用
claude mcp add nextjs-docs-mcp -- npx @taiyokimura/nextjs-docs-mcp@latest
```

Then Claude can automatically call the tool when users ask Next.js-related questions.

## Development

### Building the Package

```bash
npm run build
```

### Publishing to npm

1. Update the package name in `package.json` to your scope (e.g., @taiyokimura/nextjs-docs-mcp)
2. Build the project: `npm run build`
3. Publish: `npm publish`

### Updating Documentation URLs

The server uses a static database of Next.js documentation URLs. To update or add new documentation URLs, modify the `NEXTJS_DOCS_DATABASE` object in `src/index.ts`. The database is organized by categories and contains 200+ documentation pages covering:

- Getting Started guides
- Routing (App Router & Pages Router)
- Data Fetching patterns
- API Routes
- Deployment guides
- Performance optimization
- Guides and best practices

The static approach ensures fast response times and no external dependencies.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any improvements.
