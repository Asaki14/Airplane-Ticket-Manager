# Pitfalls Research for 真实可用 Milestone

## EXISTING_CONTEXT
Focus on common mistakes when ADDING real ticket data collection features to existing system:
- Existing system has basic CMS with manual deal entry
- Existing architecture is Next.js 13+ App Router
- Existing UI components are basic skeletons
- Existing data model is simple deal structure

## QUESTION
Common mistakes when adding [real ticket data collection from OTAs or airlines] to [domain]?

## CONSUMER
Warning signs, prevention strategy, which phase should address it:
- **Warning signs**:
  - Collecting data without checking robots.txt or terms of service
  - Making requests too frequently and getting blocked by OTAs
  - Displaying prices that don't match what users see on source sites
  - Complex scraping code that breaks when sites change slightly
  - No fallback when data collection fails
  - Pushing scraping complexity to frontend (bad for performance and blocking)
  - Not handling different date/time formats from various sources
  - Assuming all OTAs have the same data structure
  - Forgetting to handle pagination in search results
  - Not validating scraped data before storing/displaying

- **Prevention strategy**:
  - Start with manual verification: scrape one deal and verify all fields manually
  - Implement respectful rate limiting from day one (1 request/second max per source)
  - Build abstraction layer so UI doesn't know if data is scraped or manual
  - Create comprehensive validation for all scraped fields
  - Implement caching to reduce requests and improve speed
  - Design modular source adapters that are easy to update when sites change
  - Add monitoring and alerts for collection failure rates
  - Build UI that gracefully handles missing or partial data
  - Always show data freshness prominently so users know limitations
  - Implement retry logic with exponential backoff for failed requests

- **Which phase should address it**:
  - Rate respect and error handling: Collection phase
  - Data validation: Processing phase  
  - Fallback mechanisms: Storage/API phase
  - UI graceful degradation: Presentation phase
  - Monitoring: Ongoing operational concern

## QUALITY_GATE
- Pitfalls specific to adding these features: Focus on data collection pitfalls, not general web dev
- Integration pitfalls covered: How new collection system integrates with existing CMS
- Prevention actionable: Each pitfall has concrete prevention steps

## OUTPUT
Key pitfalls to avoid when implementing real ticket data collection:

### Legal and Ethical Pitfalls
- **Pitfall**: Ignoring robots.txt, terms of service, or copyright restrictions
- **Prevention**: 
  - Check robots.txt before scraping any site
  - Review terms of service for data usage restrictions
  - Consider using official APIs where available and permitted
  - Implement rate limiting that respects source site policies
  - Consider attribution requirements if displaying source-branded data

### Technical Pitfalls
- **Pitfall**: Fragile scraping that breaks with minor site changes
- **Prevention**:
  - Use multiple selectors for each element (fallback options)
  - Implement data validation that catches missing/wrong data
  - Log when expected elements aren't found to detect site changes early
  - Consider using unofficial APIs if available (often more stable than HTML scraping)
  - Create integration tests that verify scraping still works

- **Pitfall**: Getting IP blocked or rate limited by sources
- **Prevention**:
  - Implement strict rate limiting (start with 1 request every 2-3 seconds per source)
  - Use rotating user agents if making many requests
  - Consider using proxy services for IP rotation if scaling significantly
  - Implement exponential backoff when getting HTTP 429 or similar errors
  - Cache aggressively to minimize repeat requests for same data

- **Pitfall**: Inconsistent data quality from different sources
- **Prevention**:
  - Create field-by-field validation rules (price must be positive, dates must be valid, etc.)
  - Normalize data to common format immediately after scraping
  - Flag deals with missing critical information for manual review
  - Implement data quality scoring and display confidence levels
  - Allow manual overrides in CMS for problematic automated data

### Operational Pitfalls
- **Pitfall**: No visibility into collection system health
- **Prevention**:
  - Build monitoring dashboard showing:
    - Success/failure rates per source
    - Average response times
    - Data freshness metrics
    - Number of deals collected per run
  - Set up alerts for:
    - Collection failure rate > 5%
    - No successful collections in last hour
    - Significant drop in deals collected vs historical average
  - Log all collection attempts with sufficient detail for debugging

- **Pitfall**: Poor user experience when data is stale or missing
- **Prevention**:
  - Always display "Last updated" timestamp prominently
  - Show "Expires" time for time-sensitive deals
  - Implement graceful degradation: show last good data with freshness warning
  - Provide clear messaging when no deals are available for search criteria
  - Allow users to manually trigger refresh for specific searches
  - Consider showing placeholder/deals with clear "data unavailable" messaging

### Implementation Pitfalls
- **Pitfall**: Over-engineering the initial solution
- **Prevention**:
  - Start with scraping just 1-2 major Chinese OTAs (Ctrip, Qunar)
  - Focus on domestic flights first before international
  - Implement basic functionality before adding complex features like price prediction
  - Use existing Next.js API routes rather than adding separate backend services
  - Reuse existing CMS infrastructure where possible rather than building parallel systems

- **Pitfall**: Performance degradation from adding data collection
- **Prevention**:
  - Run collection workers separately from web server processes
  - Use caching layer (Redis or in-memory) to serve data quickly
  - Implement pagination/limits on API responses
  - Consider static regeneration for popular routes if data doesn't change seconds-by-second
  - Monitor bundle size and server response times after adding new dependencies