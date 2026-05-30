# DepositIQ

DepositIQ is a portfolio-grade product prototype for deposits and payments product teams. It combines public market reference data, synthetic behavioural data and deterministic decision logic to help product, pricing and strategy teams reason about:

- market rates and competitor pricing
- deposit offer complexity
- primary banking behaviour
- customer friction themes
- roadmap prioritisation

## Product overview

DepositIQ is designed as a working fintech product prototype rather than a static showcase page. The app brings together market context, product analysis and product decisioning in one cockpit:

- Overview
- Market Intelligence
- Pricing Simulator
- Product Complexity
- Primary Banking
- Customer Friction
- Prioritisation

## Problem statement

Deposits and payments teams often have fragmented views of:

- RBA rate context
- public competitor pricing
- product conditionality and complexity
- primacy and everyday banking engagement
- recurring customer friction
- initiative trade-offs across growth, risk and effort

DepositIQ brings those lenses together into a single portfolio experience.

## Target users

- Deposits product managers
- Pricing and margin teams
- Payments product teams
- Product strategy and portfolio leads
- Risk and conduct stakeholders

## Core modules

### Overview

Full-width product cockpit with market context, product thesis and module launch cards.

### Market Intelligence

- competitor rate table
- search and filter controls
- sortable columns
- KPI cards
- simple rate distribution view
- refresh action using the existing server-side market fetch path

### Pricing Simulator

- editable inputs for segment, rates, balances, churn and campaign assumptions
- live calculations
- scenario comparison
- deterministic recommendation panel

### Product Complexity

- simplicity score
- conditionality score
- customer comprehension risk
- category and risk filters

### Primary Banking

- synthetic customer table
- primary banking score
- next-best action logic
- what-if panel for salary credit, PayID, wallet and card usage

### Customer Friction

- synthetic feedback table
- theme classification
- severity-weighted score
- deterministic feedback ingestion

### Prioritisation

- weighted initiative scoring
- ranked backlog
- top 3 initiatives
- why now, stakeholder and experiment guidance

## Data sources

### Public market data

- RBA cash rate fallback anchor
- CDR Register public brand summary endpoint
- CDR Product Reference Data for savings and term deposit products

### Synthetic data

- synthetic customer primacy data
- synthetic feedback comments
- synthetic prioritisation initiatives

No real customer data is used.

## CDR caveats

CDR Product Reference Data is appropriate for public competitor comparison, but it is not a full substitute for human pricing review.

Rates may include:

- bonus conditions
- eligibility rules
- tiers and balance thresholds
- introductory periods
- linked account requirements
- term conditions

DepositIQ treats these rates as indicative only.

## RBA cash rate caveat and fallback logic

The current RBA service returns a local fallback anchor:

- `cashRateTarget: 4.35`
- `effectiveDate: "2026-05-06"`
- `source: "RBA fallback"`

The service is structured so live retrieval can be added later without changing the UI contract.

## Synthetic data explanation

Synthetic customer, feedback and initiative data exists to:

- keep the prototype safe to share
- avoid any internal or proprietary bank data
- allow deterministic scoring and interaction patterns
- make the product credible without handling sensitive customer information

## How to run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Architecture

- Next.js App Router
- TypeScript
- Tailwind CSS
- server-side API route for market data fetches
- client-side interactive modules powered by deterministic logic and local state

Important implementation rules:

- external market calls stay server-side
- fallback data keeps the product usable if live calls fail
- client components consume the internal market API only

## Roadmap

- add live RBA retrieval
- enrich competitor rate interpretation with more detailed product detail parsing
- persist user scenarios locally
- add export views for pricing and prioritisation packs
- add deeper operational resilience and servicing analytics

## Portfolio positioning

DepositIQ is a portfolio product prototype using public market data, synthetic behavioural data and deterministic decision logic.

It does not represent any bank&apos;s internal systems, customers, strategy or proprietary data.
