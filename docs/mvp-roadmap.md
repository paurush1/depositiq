# MVP Roadmap

## Phase 1: Public Comparison MVP

Goal:

Launch a working comparison site using public product data and a compliant lead handoff flow.

Build:

- product category pages
- product data ingestion jobs
- comparison filters and ranking rules
- product detail pages with source timestamps
- lead capture form with explicit consent
- bank handoff workflow
- admin review dashboard

Success measures:

- product coverage by category and bank
- data freshness SLA
- lead conversion rate
- lead delivery success rate

## Phase 2: Smarter Recommendations

Goal:

Improve matching using customer-stated preferences before touching consumer CDR data.

Build:

- needs-based questionnaire
- explainable ranking model
- scenario calculators for fees and repayments
- richer eligibility matching

Success measures:

- shortlist engagement
- click-to-lead rate
- customer satisfaction with ranking relevance

## Phase 3: CDR-Powered Personalisation

Goal:

Use customer-authorised banking data for stronger recommendations only after the right compliance path is in place.

Preconditions:

- confirmed accreditation or approved representative model
- consent management design
- privacy and deletion controls
- security controls and audit logging
- legal review of product claims and customer journey

Build:

- consent flow
- consumer-data ingestion
- personalised recommendation engine
- customer data retention and deletion workflows

## What I Recommend You Do First

1. Pick two product categories for launch, not all products at once.
2. Define a shared product schema before building scrapers.
3. Start with five to ten target banks.
4. Build manual review into the ingestion flow from the beginning.
5. Treat lead handoff as a core feature, not an afterthought.
