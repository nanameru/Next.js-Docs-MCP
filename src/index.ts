import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Next.js Documentation URL Database
const NEXTJS_DOCS_DATABASE = {
  gettingStarted: [
    { title: "Quick Start", url: "https://nextjs.org/docs/getting-started", description: "Get started with Next.js" },
    { title: "Installation", url: "https://nextjs.org/docs/getting-started/installation", description: "How to install Next.js" },
    { title: "Project Structure", url: "https://nextjs.org/docs/getting-started/project-structure", description: "Understanding Next.js project structure" }
  ],
  routing: [
    { title: "App Router", url: "https://nextjs.org/docs/app", description: "Using the App Router" },
    { title: "Pages Router", url: "https://nextjs.org/docs/pages", description: "Using the Pages Router" },
    { title: "Dynamic Routes", url: "https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes", description: "Creating dynamic routes" },
    { title: "Route Handlers", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", description: "API routes with App Router" },
    { title: "Middleware", url: "https://nextjs.org/docs/app/building-your-application/routing/middleware", description: "Using middleware for routing logic" }
  ],
  dataFetching: [
    { title: "Data Fetching Overview", url: "https://nextjs.org/docs/app/building-your-application/data-fetching", description: "Overview of data fetching patterns" },
    { title: "Fetching Data on the Server", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/fetching", description: "Server-side data fetching" },
    { title: "Server Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", description: "Using Server Components" },
    { title: "Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/client-components", description: "Using Client Components" }
  ],
  apiRoutes: [
    { title: "API Routes", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", description: "Creating API endpoints" },
    { title: "Request/Response", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-and-response", description: "Handling HTTP requests and responses" }
  ],
  deployment: [
    { title: "Deployment Overview", url: "https://nextjs.org/docs/app/building-your-application/deploying", description: "Deploying Next.js applications" },
    { title: "Static Exports", url: "https://nextjs.org/docs/app/building-your-application/deploying/static-exports", description: "Exporting static sites" },
    { title: "Vercel", url: "https://nextjs.org/docs/app/building-your-application/deploying/production-checklist", description: "Deploying to Vercel" }
  ],
  optimization: [
    { title: "Performance Optimization", url: "https://nextjs.org/docs/app/building-your-application/optimizing", description: "Optimizing your Next.js app" },
    { title: "Images", url: "https://nextjs.org/docs/app/building-your-application/optimizing/images", description: "Image optimization" },
    { title: "Caching", url: "https://nextjs.org/docs/app/building-your-application/caching", description: "Caching strategies" },
    { title: "Bundle Analyzer", url: "https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer", description: "Analyzing bundle size" }
  ]
};

class NextJSDocsServer {
  private server: Server;
  
  constructor() {
    this.server = new Server(
      {
        name: "nextjs-docs-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "search_docs",
            description: "Search Next.js documentation by keywords",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search keywords (e.g., 'routing', 'api', 'deployment')",
                },
                limit: {
                  type: "number",
                  description: "Maximum number of results to return (default: 5)",
                  default: 5,
                },
              },
              required: ["query"],
            },
          },
          {
            name: "get_docs_by_topic",
            description: "Get Next.js documentation URLs by specific topic",
            inputSchema: {
              type: "object",
              properties: {
                topic: {
                  type: "string",
                  description: "Topic category (getting-started, routing, data-fetching, api-routes, deployment, optimization)",
                  enum: ["getting-started", "routing", "data-fetching", "api-routes", "deployment", "optimization"],
                },
              },
              required: ["topic"],
            },
          },
          {
            name: "list_all_topics",
            description: "List all available documentation topics and their URLs",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "search_docs":
            return await this.searchDocs(args as { query: string; limit?: number });
          
          case "get_docs_by_topic":
            return await this.getDocsByTopic(args as { topic: string });
          
          case "list_all_topics":
            return await this.listAllTopics();
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool: ${error}`
        );
      }
    });
  }

  private async searchDocs(args: { query: string; limit?: number }) {
    const { query, limit = 5 } = args;
    const results: Array<{title: string, url: string, description: string, topic: string}> = [];
    
    // Search through all topics
    Object.entries(NEXTJS_DOCS_DATABASE).forEach(([topic, docs]) => {
      docs.forEach(doc => {
        if (
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.description.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({ ...doc, topic });
        }
      });
    });

    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} documentation pages matching "${query}":\n\n` +
            results.slice(0, limit).map(doc => 
              `📄 **${doc.title}**\n   ${doc.description}\n   🔗 ${doc.url}\n   🏷️ Topic: ${doc.topic}\n`
            ).join('\n'),
        },
      ],
    };
  }

  private async getDocsByTopic(args: { topic: string }) {
    const { topic } = args;
    const docs = (NEXTJS_DOCS_DATABASE as any)[topic];
    
    if (!docs) {
      return {
        content: [
          {
            type: "text",
            text: `Topic "${topic}" not found. Available topics: ${Object.keys(NEXTJS_DOCS_DATABASE).join(', ')}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `📚 **${topic.toUpperCase()}** Documentation:\n\n` +
            docs.map((doc: any) => 
              `📄 **${doc.title}**\n   ${doc.description}\n   🔗 ${doc.url}\n`
            ).join('\n'),
        },
      ],
    };
  }

  private async listAllTopics() {
    const allDocs: string[] = [];
    
    Object.entries(NEXTJS_DOCS_DATABASE).forEach(([topic, docs]) => {
      allDocs.push(`🏷️ **${topic.toUpperCase()}** (${docs.length} docs):`);
      docs.forEach((doc: any) => {
        allDocs.push(`   📄 ${doc.title} - ${doc.url}`);
      });
      allDocs.push('');
    });

    return {
      content: [
        {
          type: "text",
          text: `📚 **All Next.js Documentation Topics**\n\n${allDocs.join('\n')}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Next.js Docs MCP server running on stdio");
  }
}

const server = new NextJSDocsServer();
server.run().catch(console.error);
