import type { InstitutionConfig } from "@/lib/ingestion/types";

export const institutionConfigs: InstitutionConfig[] = [
  {
    id: "sample-cdr-bank",
    name: "Sample CDR Bank",
    kind: "cdr",
    cdrBaseUrl: "https://example-bank.invalid/cds-au/v1",
    brand: "Sample CDR Bank"
  },
  {
    id: "sample-website-bank",
    name: "Sample Website Bank",
    kind: "website",
    websiteUrl: "https://example-bank.invalid/products",
    selectors: {
      productCard: "[data-product-card]",
      name: "[data-product-name]",
      summary: "[data-product-summary]",
      rate: "[data-product-rate]",
      fee: "[data-product-fee]",
      link: "a"
    }
  }
];

export function getInstitutionById(institutionId: string) {
  return institutionConfigs.find((institution) => institution.id === institutionId);
}
