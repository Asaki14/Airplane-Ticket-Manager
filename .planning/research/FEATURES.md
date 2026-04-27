# Features Research for 真实可用 Milestone

## EXISTING_CONTEXT
Existing features (already built):
- Basic deal discovery interface skeleton
- Admin interface for deal lifecycle management
- Basic feed filtering and display
- Authentication gate for admin access

## QUESTION
How do [real ticket data collection and display features] typically work? Expected behavior?

## CONSUMER
Table stakes vs differentiators vs anti-features:
- **Table stakes** (expected by users):
  - Real-time or near-real-time ticket prices
  - Accurate flight information (airline, flight number, departure/arrival times)
  - Clear display of total price including taxes/fees
  - Basic filtering by origin, destination, date
  - Ability to click through to booking site

- **Differentiators** (what makes us stand out):
  - Rule translation: converting complex fare rules to simple Chinese explanations
  - Value explanation: clear "worth buying" analysis with pros/cons
  - Freshness indicators: prominent display of when data was last updated
  - Comparison side-by-side view of multiple options
  - Personalization: remembering user preferences to reduce repeated filtering

- **Anti-features** (things to avoid):
  - Fake or misleading prices (must be verifiable)
  - Hidden fees not shown upfront
  - Outdated data presented as current
  - Forced account creation before seeing basic info
  - Pop-up ads that obscure ticket information

## QUALITY_GATE
- Categories clear: Separation between data collection, data processing, and presentation layers
- Complexity noted: Start with simple data display before adding complex analytics
- Dependencies identified: Data collection depends on reliable sources; presentation depends on clean data
- Integration points: New data flows must integrate with existing CMS and feed systems

## OUTPUT
Feature categories for real ticket data implementation:

### Data Collection Layer
- **Table stakes**:
  - Fetch ticket data from at least one major OTA (Ctrip, Qunar, Fliggy) or airline
  - Parse essential fields: price, airline, flight numbers, departure/arrival times, dates
  - Handle basic error cases (network failures, site changes)
  - Respect rate limits and terms of service

- **Differentiators**:
  - Multi-source aggregation (compare same flight across different OTAs)
  - Automatic detection of price drops or special deals
  - Caching strategy to minimize requests to source sites
  - Fallback mechanisms when primary source fails

### Data Processing Layer
- **Table stakes**:
  - Normalize data format from different sources
  - Validate data completeness and reasonableness (price ranges, date validity)
  - Calculate total price including mandatory fees
  - Generate unique identifiers for each deal

- **Differentiators**:
  - Rule extraction engine: parse fare rules into structured data
  - Value scoring algorithm: price vs convenience vs flexibility trade-offs
  - Freshness scoring: weigh recent data more heavily
  - Duplicate detection: same flight appearing from multiple sources

### Presentation Layer
- **Table stakes**:
  - Display deals in card format with price prominent
  - Show airline logos and flight numbers clearly
  - Indicate stops (non-stop, 1 stop, 2+ stops)
  - Show departure/arrival times in local time
  - Link to original source for booking

- **Differentiators**:
  - Rule translation cards: convert complex rules to simple bullet points
  - Value explanation: "Worth buying because..." with specific reasons
  - Freshness badges: "Updated 2 hours ago" or "Expires in 6 hours"
  - Comparison tool: side-by-side view of 2-3 deals
  - Personalization: highlight deals matching user's saved preferences

### User Flow Features
- **Table stakes**:
  - Search by origin/destination/date
  - Sort by price, departure time, duration
  - Filter by airline, stops, price range
  - Click deal to see detailed view
  - Button/link to complete purchase on source site

- **Differentiators**:
  - Save deals for later comparison
  - Price drop alerts for saved routes
  - "Similar deals" recommendations
  - Share deal via WeChat/QR code
  - Offline caching of recently viewed deals