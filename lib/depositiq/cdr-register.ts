const REGISTER_SUMMARY_URL =
  "https://api.cdr.gov.au/cdr-register/v1/all/data-holders/brands/summary";

export type CdrBrandSummary = {
  dataHolderBrandId?: string;
  brandName: string;
  publicBaseUri?: string;
  lastUpdated?: string;
};

type RegisterResponse = {
  data?: CdrBrandSummary[];
};

export async function getCdrBrandSummaries(options?: {
  fetchImpl?: typeof fetch;
}): Promise<CdrBrandSummary[]> {
  const fetchImpl = options?.fetchImpl ?? fetch;
  const response = await fetchImpl(REGISTER_SUMMARY_URL, {
    headers: {
      Accept: "application/json",
      "x-v": "2",
      "x-min-v": "1"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `CDR Register discovery failed: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as RegisterResponse;
  return (payload.data ?? []).filter((brand) => brand.publicBaseUri);
}
