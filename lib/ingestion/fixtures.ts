import type {
  CdrProductDetailResponse,
  CdrProductListResponse,
  InstitutionConfig
} from "@/lib/ingestion/types";

export const sampleCdrInstitution: InstitutionConfig = {
  id: "fixture-cdr-bank",
  name: "Fixture CDR Bank",
  kind: "cdr",
  cdrBaseUrl: "https://fixture-bank.invalid/cds-au/v1",
  brand: "Fixture CDR"
};

export const sampleCdrProductList: CdrProductListResponse = {
  data: {
    products: [
      {
        productId: "fixture-saver-01",
        name: "Smart Saver",
        description: "Public savings account for everyday savers.",
        brand: "Fixture CDR",
        brandName: "Fixture CDR Bank",
        productCategory: "TRANS_AND_SAVINGS_ACCOUNTS",
        lastUpdated: "2026-04-22T06:00:00Z",
        applicationUri: "https://fixture-bank.invalid/apply/saver"
      },
      {
        productId: "fixture-home-loan-01",
        name: "Offset Home Loan",
        description: "Variable loan with full offset support.",
        brand: "Fixture CDR",
        brandName: "Fixture CDR Bank",
        productCategory: "RESIDENTIAL_MORTGAGES",
        lastUpdated: "2026-04-21T20:00:00Z",
        applicationUri: "https://fixture-bank.invalid/apply/home-loan"
      }
    ]
  },
  links: {},
  meta: {
    totalRecords: 2,
    totalPages: 1
  }
};

export const sampleCdrProductDetails: Record<string, CdrProductDetailResponse> = {
  "fixture-saver-01": {
    data: {
      productId: "fixture-saver-01",
      name: "Smart Saver",
      description: "Public savings account for everyday savers.",
      brandName: "Fixture CDR Bank",
      productCategory: "TRANS_AND_SAVINGS_ACCOUNTS",
      lastUpdated: "2026-04-22T06:00:00Z",
      applicationUri: "https://fixture-bank.invalid/apply/saver",
      features: [
        {
          title: "No monthly fee",
          description: "No ongoing account keeping fee."
        },
        {
          title: "Bonus interest",
          description: "Additional interest may apply when eligibility conditions are met."
        }
      ],
      depositRates: [
        {
          depositRateType: "VARIABLE",
          rate: "5.10",
          additionalInfo: "Bonus rate may require monthly deposit growth."
        }
      ],
      fees: [
        {
          name: "Monthly account fee",
          feeAmount: "0.00",
          feeType: "PERIODIC"
        }
      ],
      eligibility: [
        {
          eligibilityType: "MIN_AGE",
          additionalInfo: "Available to customers aged 14 and above."
        }
      ]
    }
  },
  "fixture-home-loan-01": {
    data: {
      productId: "fixture-home-loan-01",
      name: "Offset Home Loan",
      description: "Variable loan with full offset support.",
      brandName: "Fixture CDR Bank",
      productCategory: "RESIDENTIAL_MORTGAGES",
      lastUpdated: "2026-04-21T20:00:00Z",
      applicationUri: "https://fixture-bank.invalid/apply/home-loan",
      features: [
        {
          title: "Offset account",
          description: "100% offset account supported."
        },
        {
          title: "Redraw",
          description: "Unlimited redraw via digital banking."
        }
      ],
      lendingRates: [
        {
          lendingRateType: "VARIABLE",
          rate: "6.04",
          additionalInfo: "Owner occupier principal and interest rate."
        }
      ],
      fees: [
        {
          name: "Monthly package fee",
          feeAmount: "10.00",
          feeType: "PERIODIC"
        }
      ],
      eligibility: [
        {
          eligibilityType: "OTHER",
          additionalInfo: "Standard credit and serviceability checks apply."
        }
      ]
    }
  }
};

export const sampleWebsiteHtml = `
  <section data-product-card>
    <h3 data-product-name>Website Saver Plus</h3>
    <p data-product-summary>Simple savings product with a promotional variable rate.</p>
    <span data-product-rate>4.85% p.a. variable</span>
    <span data-product-fee>$0 monthly fee</span>
    <a href="https://fixture-bank.invalid/apply/website-saver">Apply now</a>
  </section>
`;
