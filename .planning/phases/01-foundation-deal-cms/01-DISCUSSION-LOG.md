# Phase 1: Foundation & Deal CMS - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 1-Foundation & Deal CMS
**Areas discussed:** Product architecture, Deal content model, Operations workflow, Experience direction, Pricing emphasis

---

## Product architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Single app, public + admin together | One web app with shared infra and a lightweight `/admin` style backend | ✓ |
| Single repo, but two heavily separated shells | Frontend and backend are developed as more distinct sub-apps | |
| Backend first, public shell mostly placeholder | CMS is prioritized over the public foundation | |

**User's choice:** Single web app with public and admin surfaces together.
**Notes:** The backend should use a restricted lightweight entry and should not pull full administrator authentication into Phase 1.

---

## Deal content model

| Option | Description | Selected |
|--------|-------------|----------|
| Curated finished deal | One record is a complete operator-recommended fare opportunity | ✓ |
| Raw fare records | One record is a low-level pricing row or scraped result | |
| Activity with nested options | One record is a campaign container with multiple child fares | |

**User's choice:** Curated finished deal.
**Notes:** The required schema should follow the balanced field set. Price and travel timing each need dual storage: structured values plus user-facing text where relevant.

---

## Operations workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Draft -> Published -> Expired | Lightweight MVP lifecycle | ✓ |
| Draft -> Review -> Published -> Expired | Multi-step editorial workflow | |
| Draft -> Published -> Manually unpublished -> Expired | Adds manual off-ramp control | |

**User's choice:** Draft -> Published -> Expired.
**Notes:** Expired deals should automatically disappear from the public side while remaining in the backend. Publishing should be manual per record, not batched.

---

## Experience direction

| Option | Description | Selected |
|--------|-------------|----------|
| Tool-first | Efficiency and information density dominate the whole product | |
| Travel-first | Visual inspiration and atmosphere dominate the whole product | |
| Hybrid | Tool structure with travel mood and inspiration layered in | ✓ |

**User's choice:** Hybrid.
**Notes:** The homepage should support both search/discovery efficiency and travel inspiration, but the default visual weight should lean more toward travel atmosphere. The backend should share the design system while staying cleaner and more operational.

---

## Pricing emphasis

| Option | Description | Selected |
|--------|-------------|----------|
| Headline lowest price | Public cards lead with the cheapest bookable price | ✓ |
| Reference total cost | Public cards lead with a more realistic end-to-end cost | |
| Split by surface | Feed and detail lead with different price types | |

**User's choice:** Headline lowest price.
**Notes:** Reference total-cost price should still exist in the data model and be available as supporting context.

---

## the agent's Discretion

- Technical shape of the lightweight admin gate
- Visual system implementation details
- CMS table/form ergonomics

## Deferred Ideas

None.
