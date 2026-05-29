# CDR Compliance Notes

This document is a product-building guide, not legal advice. Before launch, you should validate the model with Australian legal and compliance advisers.

## Practical Position

There are two very different data modes:

### Mode 1: Public product data

This is the recommended starting point.

Use cases:

- compare deposit accounts, cards, and loan products
- display rates, fees, features, and eligibility
- power a comparison website without touching customer banking data

Why this matters:

- banking product reference data is intended to be publicly accessible
- this is much lower compliance risk than receiving consumer data

### Mode 2: Consumer CDR data

This is for personalised recommendations based on the customer's own accounts, balances, transactions, liabilities, or repayment history.

Examples:

- "show me the best credit card based on my spending"
- "show me a home loan based on my current repayments and account history"

Why this matters:

- once you receive consumer CDR data, consent, privacy, data minimisation, security, deletion, and accreditation arrangements become central
- you should not design this as a casual extension of the MVP

## Recommended Compliance Strategy

Start with public product data and lead referral first.

Only move into consumer CDR data after deciding one of these models:

1. Become accredited or operate under a permitted CDR representative/sponsorship structure.
2. Partner with an accredited participant that handles consent and consumer-data receipt while you provide the comparison experience.

## Controls You Should Build From Day One

Even before consumer-data access, your platform should include:

- clear source attribution for each product fact
- timestamps for when data was fetched and last validated
- a review workflow for source changes
- explicit marketing and handoff consent records
- privacy policy and collection notices
- separation between public product catalog data and customer lead data

## Lead Handoff Considerations

For bank referrals, you should document:

- what customer data is collected
- why it is collected
- which bank or intermediary receives it
- whether the customer asked to be contacted or redirected to apply

Good practice:

- make the handoff customer-initiated
- capture the exact consent text version accepted
- log destination bank, time, payload summary, and delivery status

## Risks To Avoid

- scraping pages without a source-governance process and then showing stale data
- using "best product" language without transparent comparison logic and disclaimers
- mixing consumer lead data with product ingestion data in the same loose workflow
- designing for consumer CDR data before your legal operating model is clear

## Official Reference Points To Review

- Consumer Data Standards banking product APIs
- ACCC Consumer Data Right guidance
- OAIC privacy guidance for CDR participants

Use official sources as the baseline when you move from MVP into live regulated operations.

Current official starting points:

- https://consumerdatastandardsaustralia.github.io/standards/
- https://consumerdatastandardsaustralia.github.io/standards/includes/endpoint-version-schedule/
- https://www.accc.gov.au/by-industry/banking-and-finance/the-consumer-data-right
