# Starter Data Model

This scaffold uses in-memory sample data, but the shape is intended to map cleanly into a database-backed ingestion pipeline.

## Core entities

- `banks`: institution identity, brand, contact, lead routing metadata
- `products`: product-level identity, category, summary, and status
- `rates`: rate type, value, conditions, label, and effective date
- `fees`: fee type, amount, waiver conditions, and source reference
- `features`: structured booleans and descriptive features used by filters
- `eligibility_rules`: free-text and structured conditions
- `source_snapshots`: raw source payloads, page capture time, parser version, and diff status
- `lead_events`: selected product, destination bank, payload summary, and delivery result
- `consents`: customer consent text version, timestamp, channel, and scope

## Important implementation note

Do not rely on a single generic JSON field for every product fact. Use structured fields for comparison-critical attributes so ranking remains explainable and auditable.
