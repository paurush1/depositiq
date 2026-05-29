# Product And Technical Architecture

## Goal

Build a comparison platform for Australian banking products that gives customers a strong shortlist and then routes the lead to the bank the customer chooses.

## Recommended MVP

The safest MVP is a public-data comparison site, not a consumer-data recipient on day one.

MVP capabilities:

- ingest public product data from bank websites and CDR product reference data endpoints
- normalise product features into a common comparison model
- score and filter products based on customer-entered preferences
- capture customer consent for marketing contact and lead handoff
- send lead details to the selected bank or bank partner workflow
- keep a strong audit log of data source, refresh time, and customer consent

## Core User Journey

1. Customer selects a product category such as transaction account, savings account, credit card, or home loan.
2. Customer answers simple needs-based questions.
3. Platform ranks products using transparent comparison rules.
4. Customer reviews product details, fees, rates, eligibility, and disclaimers.
5. Customer chooses to be contacted or apply with a bank.
6. Platform captures explicit consent and passes the lead to the chosen bank.

## Suggested System Components

### 1. Data ingestion layer

Responsibilities:

- fetch CDR product reference data where available
- scrape or parse public bank web pages only where needed
- store raw source payloads for traceability
- schedule refreshes and detect schema/content changes

Outputs:

- raw source store
- normalised product catalog
- source quality flags

### 2. Product normalisation service

Responsibilities:

- map each bank's source fields into a shared schema
- standardise rates, fee labels, terms, eligibility, and product bundles
- tag missing or ambiguous fields for manual review

Suggested shared entities:

- bank
- product
- product_category
- rate
- fee
- feature
- eligibility_rule
- disclosure_note
- source_snapshot

### 3. Comparison and ranking engine

Responsibilities:

- apply filters such as fees, introductory rates, offset account, cashback, minimum balance, or rewards
- calculate customer-facing comparison signals
- explain why a product is ranked where it is

Important rule:

Avoid claiming "best" as a black box. Show the factors used for ranking and let customers adjust them.

### 4. Lead management layer

Responsibilities:

- collect customer details only after clear consent
- record the bank selected by the customer
- route the lead to the bank's API, CRM endpoint, email workflow, or broker process
- store an audit trail of what the customer consented to

### 5. Admin and operations console

Responsibilities:

- review source changes
- resolve failed mappings
- update product-category rules
- monitor lead delivery outcomes
- manage disclaimers and content approvals

## Recommended Initial Stack

For a small, practical first build:

- frontend: Next.js
- backend: Next.js API routes or a small Node service
- database: PostgreSQL
- queue/jobs: cron plus a job runner such as BullMQ later if needed
- scraping/parsing: Playwright for hard pages, HTML parsers for simple pages
- hosting: Vercel or a simple container platform for app, managed Postgres for data

## Data Model Direction

At a minimum, your product table should not be a flat blob. Keep product facts modular so comparisons stay explainable.

Example model areas:

- `banks`
- `products`
- `product_variants`
- `rates`
- `fees`
- `features`
- `eligibility_rules`
- `lead_events`
- `consents`
- `source_snapshots`

## Key Product Principle

Phase 1 should compare public product information.

Phase 2 can become a true personalised CDR experience only when the correct data-recipient model is in place for consumer data access and consent management.
