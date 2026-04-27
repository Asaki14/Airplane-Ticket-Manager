# Architecture Research for 真实可用 Milestone

## EXISTING_CONTEXT
Existing architecture:
- Next.js 13+ App Router architecture
- API routes in `/app/api/` directory structure
- React components in `/app/` directory
- CSS modules for styling
- Basic data models for deals
- Public/admin dual-surface structure
- Deal CMS with manual entry capability

Existing validated capabilities:
- Basic public/admin dual-surface shell with lightweight `/admin` gate
- Deal CMS data model, backend CRUD shell, and migration pipeline
- Public feed with freshness-based filtering and fixed display order
- Admin Basic gate contract restored

Existing features:
- Public-facing deal discovery interface skeleton
- Admin interface for deal lifecycle management
- Basic feed filtering and display
- Authentication gate for admin access

## QUESTION
How do [real ticket data collection features] integrate with existing architecture?

## CONSUMER
Integration points, new components, data flow changes, suggested build order:
- **New Components Needed**:
  - Data collection service/workers
  - Enhanced data models with scraped fields
  - Data validation and normalization layer
  - Caching layer
  - Enhanced API routes for serving real data
  - UI components for displaying new data fields (rule translations, freshness indicators)

- **Data Flow Changes**:
  1. **Collection Phase**: Workers/scrapers fetch data from OTA sources
  2. **Processing Phase**: Raw data parsed, validated, normalized, enriched
  3. **Storage Phase**: Processed data saved to enhanced deal model
  4. **Serving Phase**: API routes serve processed data to frontend
  5. **Presentation Phase**: UI displays enriched data with translations and value explanations

- **Suggested Build Order**:
  1. Enhance deal data model to include scraped fields
  2. Build basic data collection worker for one OTA source
  3. Create data validation and normalization layer
  4. Enhance existing CMS to accept/scrape data
  5. Update API routes to serve real data
  6. Add UI components for new data fields
  7. Implement caching layer
  8. Add multi-source capabilities
  9. Implement rule translation and value explanation features

## QUALITY_GATE
- Integration points identified: Data collection → Processing → Storage → API → Presentation
- New vs modified explicit: 
  - New: Data collection workers, validation layer, caching service
  - Modified: Deal model, CMS interface, API routes, UI components
- Build order considers deps: Model → Collection → Validation → Storage → API → UI
- Integration considered: All new components designed to work with existing Next.js App Router structure

## OUTPUT
Architecture recommendations for real ticket data implementation:

### Enhanced Data Model
Extend existing deal model with:
- `source`: OTA or airline name (string)
- `sourceId`: Unique ID from source system (string)
- `rawData`: Original scraped data for debugging (JSON)
- `collectedAt`: Timestamp of data collection (ISO string)
- `expiresAt`: When data becomes stale (ISO string)
- `isActive`: Whether deal is currently bookable (boolean)
- `priceBreakdown`: Detailed pricing (base, taxes, fees) (object)
- `ruleSummary`: Structured rule data for translation (object)
- `valueScore`: Calculated worth-buying score (number)

### Data Collection Layer
- **Worker Service**: Node.js script that runs on schedule (via Vercel Cron Jobs or similar)
- **Source Adapters**: Separate modules for each OTA/airline (CtripAdapter, QunarAdapter, etc.)
- **Rate Limiting**: Built into each adapter to respect source limits
- **Error Handling**: Retry logic, circuit breaker pattern, fallback to cached data
- **Logging**: Structured logging of collection success/failure rates

### Processing Pipeline
- **Validation Stage**: Check for required fields, reasonable values, date validity
- **Normalization Stage**: Convert different source formats to common schema
- **Enrichment Stage**: 
  - Calculate total price with all mandatory fees
  - Extract and structure fare rules for translation
  - Generate value explanation based on price vs convenience factors
  - Determine freshness score
- **Deduplication Stage**: Identify same flight from multiple sources

### Storage Enhancement
- **Write Path**: Collection workers write to enhanced deal model via API or direct DB access
- **Read Path**: Existing CMS updated to show scraped deals alongside manually entered ones
- **Migration**: Script to backfill existing deals with source metadata

### API Layer
- **Enhanced Feed Endpoint**: `/app/api/deals/feed` returns real scraped data
- **Deal Detail Endpoint**: `/app/api/deals/[id]` shows complete data including rules
- **Collection Trigger Endpoint**: `/app/api/collect` (protected) to manually start collection
- **Status Endpoint**: `/app/api/collect/status` shows last collection times, success rates

### Presentation Layer Updates
- **Deal Card**: Add source badge, freshness indicator, price breakdown toggle
- **Deal Detail Page**: 
  - Prominent display of collected/expires timestamps
  - Rule translation card section
  - Value explanation section
  - Price breakdown details
  - Source link with disclosure
- **Comparison View**: Enhanced to show rule differences and value scores

### Infrastructure Considerations
- **Caching**: Use node-cache or Redis to reduce load on sources and improve response time
- **Background Jobs**: Vercel Cron Jobs for scheduled collection, or simple Node.js cron
- **Monitoring**: Track collection success rate, data freshness, error rates
- **Fallback**: If collection fails, system degrades gracefully to last known good data or manual CMS entries