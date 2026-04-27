# Research Summary for 真实可用 Milestone

## Stack additions:
- HTTP Client: axios ^1.6.0 or node-fetch ^3.3.0 for OTA/API requests
- HTML Parser: cheerio ^1.0.0 for website scraping (if no official APIs)
- Rate Limiting: bottleneck ^2.19.0 to respect OTA rate limits
- Caching: node-cache ^5.1.0 or Redis for caching ticket data
- Scheduler: node-cron ^3.0.0 for periodic data refresh
- Data Validation: zod ^3.21.0 for validating scraped ticket data
- Logging: pino ^8.14.0 for structured logging

## Feature table stakes:
- Real-time or near-real-time ticket prices from at least one major OTA
- Accurate flight information (airline, flight numbers, departure/arrival times)
- Clear display of total price including taxes/fees
- Basic filtering by origin, destination, date
- Ability to click through to booking site
- Data validation and normalization layer
- Enhanced deal model with scraped fields (source, collectedAt, expiresAt, etc.)
- API routes serving real collected data
- UI components displaying basic deal information

## Watch Out For:
- Legal/Ethical: Ignoring robots.txt, terms of service, or making excessive requests
- Technical: Fragile scraping that breaks with site changes, getting IP blocked by sources
- Data Quality: Inconsistent data from different sources, displaying outdated or incorrect prices
- Operational: No visibility into collection system health, poor UX when data is stale/missing
- Implementation: Over-engineering initial solution, performance degradation from new dependencies
- Key Prevention: Start small (1-2 OTAs), implement rate limiting from day one, build validation layer, add monitoring, design graceful degradation