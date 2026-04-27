# Stack Research for 真实可用 Milestone

## EXISTING_CONTEXT
Existing validated capabilities (DO NOT re-research):
- Basic public/admin dual-surface shell with lightweight `/admin` gate
- Deal CMS data model, backend CRUD shell, and migration pipeline for manual deal management
- Public feed with freshness-based filtering and fixed display order (price/reference price/freshness)
- Admin Basic gate contract restored for `/admin/deals` and `/admin/deals/{id}`

Existing features (already built):
- Public-facing deal discovery interface skeleton
- Admin interface for deal lifecycle management
- Basic feed filtering and display
- Authentication gate for admin access

Existing architecture:
- Next.js 13+ App Router architecture
- API routes in `/app/api/` directory structure
- React components in `/app/` directory
- CSS modules for styling
- Basic data models for deals

## QUESTION
What stack additions/changes are needed for [real ticket data collection from OTAs or airlines]?

## CONSUMER
Specific libraries with versions for NEW capabilities:
- **HTTP Client**: axios ^1.6.0 or node-fetch ^3.3.0 for making requests to OTA/API endpoints
- **HTML Parser**: cheerio ^1.0.0 for scraping OTA websites if no official APIs available
- **Rate Limiting**: bottleneck ^2.19.0 or similar to respect OTA rate limits
- **Caching**: node-cache ^5.1.0 or Redis (if adding backend) to cache ticket data and reduce API calls
- **Scheduler**: node-cron ^3.0.0 for periodic data refresh
- **Data Validation**: zod ^3.21.0 for validating scraped/parsed ticket data
- **Logging**: pino ^8.14.0 for structured logging of data collection processes

Integration points:
- New `/app/api/collect` route for triggering data collection
- Enhanced `/app/api/deals/feed` to serve real collected data
- Background job system (could use Vercel Cron Jobs or similar)
- Data storage layer (enhance existing deal model with scraped fields)

What NOT to add:
- Heavy weight scraping frameworks like Puppeteer or Playwright initially (start with lightweight HTTP + Cheerio)
- Full-blown message queues (start with simple cron-based approach)
- Complex ML/NLP for rule parsing (start with regex-based approaches)

## QUALITY_GATE
- Versions current: Check npm for latest stable versions of selected libraries
- Rationale: Lightweight approach minimizes bundle size and complexity while providing necessary functionality
- Integration considered: All new packages should be compatible with Next.js 13+ and existing architecture
- Categories clear: Separation of concerns between data collection, processing, storage, and API layers
- Complexity noted: Initial focus on simple REST APIs and HTML scraping before considering WebSocket or GraphQL
- Dependencies identified: All new packages explicitly listed with version constraints

## OUTPUT
Key stack recommendations for real ticket data collection:
1. **Primary Approach**: Use axios + cheerio for OTA website scraping with rate limiting
2. **Alternative Approach**: If official APIs available (like Skyscanner API, Amadeus API), use axios with API key management
3. **Data Flow**: Scrape → Parse/Validate → Cache → Serve via API
4. **Infrastructure**: Enhance existing Next.js app with API routes and background jobs
5. **Risk Mitigation**: Start with 1-2 major OTA targets (like Ctrip, Qunar) before expanding