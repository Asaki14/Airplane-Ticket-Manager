# Phase 1: Foundation & Deal CMS - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the initial project shell for the special-fare flight platform, including a unified web app structure, a mobile-first responsive foundation, and a lightweight internal CMS for operators to create and publish structured deal entries. It does not include the public discovery feed experience, rule-decoding detail view, comparison workflows, or user accounts.

</domain>

<decisions>
## Implementation Decisions

### Product architecture
- **D-01:** Phase 1 uses a single web application that contains both the public-facing site and the operator backend.
- **D-02:** The operator backend should live as a lightweight restricted entry point, such as `/admin`, rather than a fully separate app.
- **D-03:** Phase 1 does not include a full administrator authentication system; backend access should stay intentionally lightweight for MVP validation.

### Deal content model
- **D-04:** One CMS deal record represents a finished, operator-curated fare recommendation, not a raw fare data row or scraped inventory record.
- **D-05:** The initial deal schema should use a balanced field set: title, departure city, destination, headline price, currency, one-way/round-trip flag, travel window, airline, direct/transfer indicator, baggage info, refund/change summary, source link, publish time, update time, expiry time, recommendation copy, and value tags.
- **D-06:** Price storage should support both the lowest bookable headline price and a separate reference total-cost price, even if the public card emphasizes only one.
- **D-07:** Travel timing should support both structured start/end dates and a user-facing readable travel-window label.

### Operations workflow
- **D-08:** Deal lifecycle in Phase 1 is limited to `draft -> published -> expired`.
- **D-09:** Expired deals should automatically disappear from the public experience while remaining available in the backend for reference.
- **D-10:** Publishing should be controlled manually per deal; batch publishing is out of scope for this phase.

### Experience direction
- **D-11:** The product should follow a hybrid direction: the structural interaction model is tool-like and efficient, but the visual tone should still feel travel-oriented rather than purely back-office.
- **D-12:** The public homepage shell should support both discovery/search efficiency and travel inspiration, but its default visual emphasis should lean more toward travel atmosphere.
- **D-13:** The backend should reuse the same design system as the public site while staying visually quieter, cleaner, and more operational.

### Pricing emphasis
- **D-14:** Public-facing deal cards should default to the lowest bookable headline price as the primary displayed price.
- **D-15:** Reference total-cost pricing should still be available in the data model and surfaced as supporting context rather than replacing the headline price.

### the agent's Discretion
- Exact technical implementation of the restricted admin entry
- CMS form layout, validation style, and list/table presentation
- Final naming for price fields and status fields
- Exact responsive breakpoints, spacing scale, and typography choices

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core planning context
- `.planning/PROJECT.md` — Product framing, target users, constraints, and Phase 1-relevant positioning decisions
- `.planning/REQUIREMENTS.md` — Source requirements for Phase 1, especially `OPS-01`, `OPS-02`, and `PREF-03`
- `.planning/ROADMAP.md` — Phase boundary, phase goal, success criteria, and plan breakdown for Phase 1
- `.planning/STATE.md` — Current project state and blockers that should inform planning

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — this is a greenfield project with no application source files in place.

### Established Patterns
- No established code patterns yet. Planner and researcher can choose the initial application structure, but should preserve the locked product decisions above.

### Integration Points
- Public site shell and `/admin` backend should be designed as two surfaces within the same app foundation.
- Deal data model should be designed so Phase 2 discovery feed and Phase 3 detail/rule-decoding work can build directly on the Phase 1 CMS schema.

</code_context>

<specifics>
## Specific Ideas

- The backend should feel like a controlled internal tool, but not like a separate product.
- The public shell should avoid a cold dashboard feeling; travel atmosphere should be visible immediately even when utility remains primary.
- Headline pricing should remain strong enough to catch attention quickly, with more realistic total-cost context available beneath it.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-deal-cms*
*Context gathered: 2026-04-11*
