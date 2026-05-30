# Ingestion Layer

This project now includes a starter ingestion layer that supports two source paths:

- public CDR product endpoints
- public bank website parsing
- official CDR Register discovery for locating real banking brands and product base URIs

## CDR path

The current implementation is shaped around the official public product endpoints:

- `GET /banking/products`
- `GET /banking/product/{productId}`

The app can also discover real data holder brands from the official Register endpoint:

- `GET https://api.cdr.gov.au/cdr-register/v1/banking/data-holders/brands/summary`

Headers:

- `Accept: application/json`
- `x-v`
- `x-min-v`

Important date context as of 22 April 2026:

- `GET /banking/products` V4 became binding on 16 March 2026 and is scheduled to retire on 10 August 2026.
- `GET /banking/products` V5 becomes binding on 13 July 2026.
- `GET /banking/product/{productId}` V6 became binding on 16 March 2026 and is scheduled to retire on 10 August 2026.
- `GET /banking/product/{productId}` V7 becomes binding on 13 July 2026.

The code therefore uses version negotiation instead of assuming one permanent version.

Register discovery details from the current standards:

- the public brand summary endpoint is version `2`
- each brand summary includes `productBaseUri`
- `productBaseUri` is the cleanest starting point for public product reference data

## Website path

Website ingestion is intentionally kept configurable per institution:

- product-card selector
- name selector
- summary selector
- rate selector
- fee selector
- application link selector

In production, you will likely replace the simple HTML parser with:

- structured bank-specific parsers
- Playwright for JavaScript-heavy pages
- manual review for changed layouts or ambiguous content

## Output shape

Both source paths normalize into a common product record with:

- product identity
- source snapshots
- category mapping
- rate label
- fee label and parsed fee value
- feature flags like offset, rewards, and intro offer
- eligibility text
- application URL

## Recommended next step

Use `api/ingest/discover` to find real banking brands, then run `api/ingest/preview` with `register=true` for a short list of banks before persisting normalized results into Postgres.
