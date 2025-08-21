#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from 'axios';

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
    { title: "Bundle Analyzer", url: "https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer", description: "Analyzing bundle size" },
    { title: "Building Your Application: Optimizing", url: "https://nextjs.org/docs/app/building-your-application/optimizing", description: "Optimizing Next.js applications" },
    { title: "Optimizing: Images", url: "https://nextjs.org/docs/app/building-your-application/optimizing/images", description: "Image optimization" },
    { title: "Optimizing: Videos", url: "https://nextjs.org/docs/app/building-your-application/optimizing/videos", description: "Video optimization" },
    { title: "Optimizing: Fonts", url: "https://nextjs.org/docs/app/building-your-application/optimizing/fonts", description: "Font optimization" },
    { title: "Optimizing: Metadata", url: "https://nextjs.org/docs/app/building-your-application/optimizing/metadata", description: "Metadata optimization" },
    { title: "Optimizing: Scripts", url: "https://nextjs.org/docs/app/building-your-application/optimizing/scripts", description: "Script optimization" },
    { title: "Optimizing: Bundle Analyzer", url: "https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer", description: "Bundle analyzer" },
    { title: "Optimizing: Lazy Loading", url: "https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading", description: "Lazy loading" },
    { title: "Optimizing: Analytics", url: "https://nextjs.org/docs/app/building-your-application/optimizing/analytics", description: "Analytics optimization" },
    { title: "Optimizing: Instrumentation", url: "https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation", description: "Instrumentation" },
    { title: "Optimizing: OpenTelemetry", url: "https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry", description: "OpenTelemetry" },
    { title: "Optimizing: Static Assets", url: "https://nextjs.org/docs/app/building-your-application/optimizing/static-assets", description: "Static assets optimization" },
    { title: "Optimizing: Third Party Libraries", url: "https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries", description: "Third party libraries optimization" },
    { title: "Optimizing: Memory Usage", url: "https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage", description: "Memory usage optimization" }
  ],
  "guides": [
    { title: "App Router: Guides", url: "https://nextjs.org/docs/app/guides", description: "Guides for the App Router" },
    { title: "Guides: Analytics", url: "https://nextjs.org/docs/app/guides/analytics", description: "Analytics guide" },
    { title: "Guides: Authentication", url: "https://nextjs.org/docs/app/guides/authentication", description: "Authentication guide" },
    { title: "Guides: Backend for Frontend", url: "https://nextjs.org/docs/app/guides/backend-for-frontend", description: "Backend for Frontend pattern" },
    { title: "Guides: Caching", url: "https://nextjs.org/docs/app/guides/caching", description: "Caching guide" },
    { title: "Guides: CI Build Caching", url: "https://nextjs.org/docs/app/guides/ci-build-caching", description: "CI build caching" },
    { title: "Guides: Content Security Policy", url: "https://nextjs.org/docs/app/guides/content-security-policy", description: "Content Security Policy guide" },
    { title: "Guides: CSS-in-JS", url: "https://nextjs.org/docs/app/guides/css-in-js", description: "CSS-in-JS guide" },
    { title: "Guides: Custom Server", url: "https://nextjs.org/docs/app/guides/custom-server", description: "Custom server guide" },
    { title: "Guides: Data Security", url: "https://nextjs.org/docs/app/guides/data-security", description: "Data security guide" },
    { title: "Guides: Debugging", url: "https://nextjs.org/docs/app/guides/debugging", description: "Debugging guide" },
    { title: "Guides: Draft Mode", url: "https://nextjs.org/docs/app/guides/draft-mode", description: "Draft mode guide" },
    { title: "Guides: Environment Variables", url: "https://nextjs.org/docs/app/guides/environment-variables", description: "Environment variables guide" },
    { title: "Guides: Forms", url: "https://nextjs.org/docs/app/guides/forms", description: "Forms guide" },
    { title: "Guides: ISR", url: "https://nextjs.org/docs/app/guides/incremental-static-regeneration", description: "Incremental Static Regeneration" },
    { title: "Guides: Instrumentation", url: "https://nextjs.org/docs/app/guides/instrumentation", description: "Instrumentation guide" },
    { title: "Guides: Internationalization", url: "https://nextjs.org/docs/app/guides/internationalization", description: "Internationalization guide" },
    { title: "Guides: JSON-LD", url: "https://nextjs.org/docs/app/guides/json-ld", description: "JSON-LD guide" },
    { title: "Guides: Lazy Loading", url: "https://nextjs.org/docs/app/guides/lazy-loading", description: "Lazy loading guide" },
    { title: "Guides: Development Environment", url: "https://nextjs.org/docs/app/guides/local-development", description: "Local development guide" },
    { title: "Guides: MDX", url: "https://nextjs.org/docs/app/guides/mdx", description: "MDX guide" },
    { title: "Guides: Memory Usage", url: "https://nextjs.org/docs/app/guides/memory-usage", description: "Memory usage guide" },
    { title: "Guides: Migrating", url: "https://nextjs.org/docs/app/guides/migrating", description: "Migration guide" },
    { title: "Migrating: App Router", url: "https://nextjs.org/docs/app/guides/migrating/app-router-migration", description: "App Router migration guide" },
    { title: "Migrating: Create React App", url: "https://nextjs.org/docs/app/guides/migrating/from-create-react-app", description: "Migrating from Create React App" },
    { title: "Migrating: Vite", url: "https://nextjs.org/docs/app/guides/migrating/from-vite", description: "Migrating from Vite" },
    { title: "Guides: Multi-tenant", url: "https://nextjs.org/docs/app/guides/multi-tenant", description: "Multi-tenant guide" },
    { title: "Guides: Multi-zones", url: "https://nextjs.org/docs/app/guides/multi-zones", description: "Multi-zones guide" },
    { title: "Guides: OpenTelemetry", url: "https://nextjs.org/docs/app/guides/open-telemetry", description: "OpenTelemetry guide" },
    { title: "Guides: Package Bundling", url: "https://nextjs.org/docs/app/guides/package-bundling", description: "Package bundling guide" },
    { title: "Guides: Prefetching", url: "https://nextjs.org/docs/app/guides/prefetching", description: "Prefetching guide" },
    { title: "Guides: Production", url: "https://nextjs.org/docs/app/guides/production-checklist", description: "Production checklist" },
    { title: "Guides: PWAs", url: "https://nextjs.org/docs/app/guides/progressive-web-apps", description: "Progressive Web Apps guide" },
    { title: "Guides: Redirecting", url: "https://nextjs.org/docs/app/guides/redirecting", description: "Redirecting guide" },
    { title: "Guides: Sass", url: "https://nextjs.org/docs/app/guides/sass", description: "Sass guide" },
    { title: "Guides: Scripts", url: "https://nextjs.org/docs/app/guides/scripts", description: "Scripts guide" },
    { title: "Guides: Self-Hosting", url: "https://nextjs.org/docs/app/guides/self-hosting", description: "Self-hosting guide" },
    { title: "Guides: SPAs", url: "https://nextjs.org/docs/app/guides/single-page-applications", description: "Single Page Applications guide" },
    { title: "Guides: Static Exports", url: "https://nextjs.org/docs/app/guides/static-exports", description: "Static exports guide" },
    { title: "Guides: Tailwind CSS v3", url: "https://nextjs.org/docs/app/guides/tailwind-v3-css", description: "Tailwind CSS v3 guide" },
    { title: "Guides: Testing", url: "https://nextjs.org/docs/app/guides/testing", description: "Testing guide" },
    { title: "Testing: Cypress", url: "https://nextjs.org/docs/app/guides/testing/cypress", description: "Testing with Cypress" },
    { title: "Testing: Jest", url: "https://nextjs.org/docs/app/guides/testing/jest", description: "Testing with Jest" },
    { title: "Testing: Playwright", url: "https://nextjs.org/docs/app/guides/testing/playwright", description: "Testing with Playwright" },
    { title: "Testing: Vitest", url: "https://nextjs.org/docs/app/guides/testing/vitest", description: "Testing with Vitest" },
    { title: "Guides: Third Party Libraries", url: "https://nextjs.org/docs/app/guides/third-party-libraries", description: "Third party libraries guide" },
    { title: "Guides: Upgrading", url: "https://nextjs.org/docs/app/guides/upgrading", description: "Upgrading guide" },
    { title: "Upgrading: Codemods", url: "https://nextjs.org/docs/app/guides/upgrading/codemods", description: "Codemods for upgrading" },
    { title: "Upgrading: Version 14", url: "https://nextjs.org/docs/app/guides/upgrading/version-14", description: "Upgrading to version 14" },
    { title: "Upgrading: Version 15", url: "https://nextjs.org/docs/app/guides/upgrading/version-15", description: "Upgrading to version 15" },
    { title: "Guides: Videos", url: "https://nextjs.org/docs/app/guides/videos", description: "Video guides" }
  ],
  "api-reference": [
    { title: "App Router: API Reference", url: "https://nextjs.org/docs/app/api-reference", description: "API reference for App Router" },
    { title: "API Reference: Directives", url: "https://nextjs.org/docs/app/api-reference/directives", description: "Directives reference" },
    { title: "Directives: use cache", url: "https://nextjs.org/docs/app/api-reference/directives/use-cache", description: "use cache directive" },
    { title: "Directives: use client", url: "https://nextjs.org/docs/app/api-reference/directives/use-client", description: "use client directive" },
    { title: "Directives: use server", url: "https://nextjs.org/docs/app/api-reference/directives/use-server", description: "use server directive" },
    { title: "API Reference: Components", url: "https://nextjs.org/docs/app/api-reference/components", description: "Components reference for App Router" },
    { title: "Components: Font", url: "https://nextjs.org/docs/app/api-reference/components/font", description: "Font component for App Router" },
    { title: "Components: Form Component", url: "https://nextjs.org/docs/app/api-reference/components/form", description: "Form component for App Router" },
    { title: "Components: Image Component", url: "https://nextjs.org/docs/app/api-reference/components/image", description: "Image component for App Router" },
    { title: "Components: Link Component", url: "https://nextjs.org/docs/app/api-reference/components/link", description: "Link component for App Router" },
    { title: "Components: Script Component", url: "https://nextjs.org/docs/app/api-reference/components/script", description: "Script component for App Router" },
    { title: "API Reference: File-system conventions", url: "https://nextjs.org/docs/app/api-reference/file-conventions", description: "File-system conventions for App Router" },
    { title: "File-system conventions: default.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/default", description: "default.js file convention" },
    { title: "File-system conventions: Dynamic Segments", url: "https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes", description: "Dynamic segments" },
    { title: "File-system conventions: error.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/error", description: "error.js file convention" },
    { title: "File-system conventions: forbidden.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/forbidden", description: "forbidden.js file convention" },
    { title: "File-system conventions: instrumentation.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation", description: "instrumentation.js file convention" },
    { title: "File-system conventions: instrumentation-client.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client", description: "instrumentation-client.js file convention" },
    { title: "File-system conventions: Intercepting Routes", url: "https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes", description: "Intercepting routes" },
    { title: "File-system conventions: layout.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/layout", description: "layout.js file convention" },
    { title: "File-system conventions: loading.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading", description: "loading.js file convention" },
    { title: "File-system conventions: mdx-components.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components", description: "mdx-components.js file convention" },
    { title: "File-system conventions: middleware.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/middleware", description: "middleware.js file convention" },
    { title: "File-system conventions: not-found.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/not-found", description: "not-found.js file convention" },
    { title: "File-system conventions: page.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/page", description: "page.js file convention" },
    { title: "File-system conventions: Parallel Routes", url: "https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes", description: "Parallel routes" },
    { title: "File-system conventions: public", url: "https://nextjs.org/docs/app/api-reference/file-conventions/public-folder", description: "public folder" },
    { title: "File-system conventions: route.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/route", description: "route.js file convention" },
    { title: "File-system conventions: Route Groups", url: "https://nextjs.org/docs/app/api-reference/file-conventions/route-groups", description: "Route groups" },
    { title: "File-system conventions: Route Segment Config", url: "https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config", description: "Route segment config" },
    { title: "File-system conventions: src", url: "https://nextjs.org/docs/app/api-reference/file-conventions/src-folder", description: "src folder" },
    { title: "File-system conventions: template.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/template", description: "template.js file convention" },
    { title: "File-system conventions: unauthorized.js", url: "https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized", description: "unauthorized.js file convention" },
    { title: "File-system conventions: Metadata Files", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata", description: "Metadata files" },
    { title: "Metadata Files: favicon, icon, and apple-icon", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons", description: "App icons" },
    { title: "Metadata Files: manifest.json", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest", description: "Web app manifest" },
    { title: "Metadata Files: opengraph-image and twitter-image", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image", description: "Open Graph images" },
    { title: "Metadata Files: robots.txt", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots", description: "Robots.txt" },
    { title: "Metadata Files: sitemap.xml", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap", description: "Sitemap.xml" },
    { title: "API Reference: Functions", url: "https://nextjs.org/docs/app/api-reference/functions", description: "Functions reference for App Router" },
    { title: "Functions: after", url: "https://nextjs.org/docs/app/api-reference/functions/after", description: "after function" },
    { title: "Functions: cacheLife", url: "https://nextjs.org/docs/app/api-reference/functions/cacheLife", description: "cacheLife function" },
    { title: "Functions: cacheTag", url: "https://nextjs.org/docs/app/api-reference/functions/cacheTag", description: "cacheTag function" },
    { title: "Functions: connection", url: "https://nextjs.org/docs/app/api-reference/functions/connection", description: "connection function" },
    { title: "Functions: cookies", url: "https://nextjs.org/docs/app/api-reference/functions/cookies", description: "cookies function" },
    { title: "Functions: draftMode", url: "https://nextjs.org/docs/app/api-reference/functions/draft-mode", description: "draftMode function" },
    { title: "Functions: fetch", url: "https://nextjs.org/docs/app/api-reference/functions/fetch", description: "fetch function" },
    { title: "Functions: forbidden", url: "https://nextjs.org/docs/app/api-reference/functions/forbidden", description: "forbidden function" },
    { title: "Functions: generateImageMetadata", url: "https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata", description: "generateImageMetadata function" },
    { title: "Functions: generateMetadata", url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata", description: "generateMetadata function" },
    { title: "Functions: generateSitemaps", url: "https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps", description: "generateSitemaps function" },
    { title: "Functions: generateStaticParams", url: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params", description: "generateStaticParams function" },
    { title: "Functions: generateViewport", url: "https://nextjs.org/docs/app/api-reference/functions/generate-viewport", description: "generateViewport function" },
    { title: "Functions: headers", url: "https://nextjs.org/docs/app/api-reference/functions/headers", description: "headers function" },
    { title: "Functions: ImageResponse", url: "https://nextjs.org/docs/app/api-reference/functions/image-response", description: "ImageResponse function" },
    { title: "Functions: NextRequest", url: "https://nextjs.org/docs/app/api-reference/functions/next-request", description: "NextRequest function" },
    { title: "Functions: NextResponse", url: "https://nextjs.org/docs/app/api-reference/functions/next-response", description: "NextResponse function" },
    { title: "Functions: notFound", url: "https://nextjs.org/docs/app/api-reference/functions/not-found", description: "notFound function" },
    { title: "Functions: permanentRedirect", url: "https://nextjs.org/docs/app/api-reference/functions/permanentRedirect", description: "permanentRedirect function" },
    { title: "Functions: redirect", url: "https://nextjs.org/docs/app/api-reference/functions/redirect", description: "redirect function" },
    { title: "Functions: revalidatePath", url: "https://nextjs.org/docs/app/api-reference/functions/revalidatePath", description: "revalidatePath function" },
    { title: "Functions: revalidateTag", url: "https://nextjs.org/docs/app/api-reference/functions/revalidateTag", description: "revalidateTag function" },
    { title: "Functions: unauthorized", url: "https://nextjs.org/docs/app/api-reference/functions/unauthorized", description: "unauthorized function" },
    { title: "Functions: unstable_cache", url: "https://nextjs.org/docs/app/api-reference/functions/unstable_cache", description: "unstable_cache function" },
    { title: "Functions: unstable_noStore", url: "https://nextjs.org/docs/app/api-reference/functions/unstable_noStore", description: "unstable_noStore function" },
    { title: "Functions: unstable_rethrow", url: "https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow", description: "unstable_rethrow function" },
    { title: "Functions: useLinkStatus", url: "https://nextjs.org/docs/app/api-reference/functions/use-link-status", description: "useLinkStatus function" },
    { title: "Functions: useParams", url: "https://nextjs.org/docs/app/api-reference/functions/use-params", description: "useParams function" },
    { title: "Functions: usePathname", url: "https://nextjs.org/docs/app/api-reference/functions/use-pathname", description: "usePathname function" },
    { title: "Functions: useReportWebVitals", url: "https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals", description: "useReportWebVitals function" },
    { title: "Functions: useRouter", url: "https://nextjs.org/docs/app/api-reference/functions/use-router", description: "useRouter function" },
    { title: "Functions: useSearchParams", url: "https://nextjs.org/docs/app/api-reference/functions/use-search-params", description: "useSearchParams function" },
    { title: "Functions: useSelectedLayoutSegment", url: "https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment", description: "useSelectedLayoutSegment function" },
    { title: "Functions: useSelectedLayoutSegments", url: "https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments", description: "useSelectedLayoutSegments function" },
    { title: "Functions: userAgent", url: "https://nextjs.org/docs/app/api-reference/functions/userAgent", description: "userAgent function" },
    { title: "API Reference: Configuration", url: "https://nextjs.org/docs/app/api-reference/config", description: "Configuration reference for App Router" },
    { title: "Configuration: next.config.js", url: "https://nextjs.org/docs/app/api-reference/config/next-config-js", description: "next.config.js for App Router" },
    { title: "Configuration: TypeScript", url: "https://nextjs.org/docs/app/api-reference/config/typescript", description: "TypeScript configuration for App Router" },
    { title: "Configuration: ESLint", url: "https://nextjs.org/docs/app/api-reference/config/eslint", description: "ESLint configuration for App Router" },
    { title: "API Reference: CLI", url: "https://nextjs.org/docs/app/api-reference/cli", description: "CLI reference for App Router" },
    { title: "CLI: create-next-app", url: "https://nextjs.org/docs/app/api-reference/cli/create-next-app", description: "create-next-app CLI for App Router" },
    { title: "CLI: next CLI", url: "https://nextjs.org/docs/app/api-reference/cli/next", description: "next CLI for App Router" },
    { title: "API Reference: Edge Runtime", url: "https://nextjs.org/docs/app/api-reference/edge", description: "Edge Runtime reference" },
    { title: "API Reference: Turbopack", url: "https://nextjs.org/docs/app/api-reference/turbopack", description: "Turbopack reference for App Router" }
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
            name: "get_all_docs",
            description: "Provide all Next.js documentation URLs for AI agents.\n\nAuto-trigger guidance (for clients):\n- Run when the user asks about 'Next.js', 'Nextjs', 'Next', or mentions topics like 'App Router', 'Pages Router', 'Route Handlers', 'data fetching', 'deployment', 'turbopack', 'Vercel'.\n- Run when the user reports errors containing keywords like 'Next.js error', 'build error', 'routing error', 'hydration error', 'module not found', 'next.config.js', 'middleware', 'Image', 'Link', 'Route Handler'.\n- Run when an active file path suggests a Next.js app, e.g. 'next.config.js', 'app/**', 'pages/**', 'middleware.ts/js', or imports starting with 'next/'.\n\nPost-call agent instructions (MUST DO):\n- After receiving the list, FETCH the content of the top relevant URLs (at least the first 3–5) to ground answers in the actual docs.\n- Use standard HTTP GET with a 10s timeout, follow redirects, and limit concurrency to 3 to be polite.\n- Prefer pages whose title/URL matches the user's query or error message; summarize only after fetching.\n- If fetching fails, try the next candidate URL and report which ones were fetched.\nThis tool returns a comprehensive list so the agent can pick and fetch the most relevant docs.",
            inputSchema: {
              type: "object",
              properties: {
                context: {
                  type: "string",
                  description: "Optional user query, error message, or code snippet used by the client to decide invocation",
                },
                filePath: {
                  type: "string",
                  description: "Optional current file path used by the client to decide invocation",
                },
              },
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
          case "get_all_docs":
            return await this.getAllDocsForClaude();
          
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

  private async getAllDocsForClaude() {
    const allDocs: Array<{title: string, url: string, description: string, category: string}> = [];

    // データベースから全ドキュメントを取得
    Object.entries(NEXTJS_DOCS_DATABASE).forEach(([category, docs]) => {
      docs.forEach((doc: any) => {
        allDocs.push({
          title: doc.title,
          url: doc.url,
          description: doc.description,
          category: category
        });
      });
    });

    // Claudeが理解しやすい形式で出力
    const formattedDocs = allDocs.map((doc, index) =>
      `${index + 1}. **${doc.title}**\n   📁 Category: ${doc.category}\n   🔗 ${doc.url}\n   📝 ${doc.description}\n`
    ).join('\n');

    return {
      content: [
        {
          type: "text",
          text: `📚 **Next.js Documentation - All Available Documents**\n\n` +
                `Total documents: ${allDocs.length}\n\n` +
                `以下は全てのNext.jsドキュメントURLです。あなたのクエリに関連するドキュメントをこれらの中から選んでください：\n\n` +
                `${formattedDocs}\n\n` +
                `---\n` +
                `**使い方:**\n` +
                `これらのドキュメントの中から、あなたの質問や問題に関連するものを選んで、該当するURLを参照してください。`,
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
