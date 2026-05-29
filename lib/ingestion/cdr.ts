import { sampleCdrProductDetails, sampleCdrProductList } from "@/lib/ingestion/fixtures";
import { normalizeCdrProduct } from "@/lib/ingestion/normalize";
import type {
  CdrProductDetail,
  CdrProductDetailResponse,
  CdrProductListResponse,
  IngestionRunResult,
  InstitutionConfig,
  RawSourceSnapshot
} from "@/lib/ingestion/types";

const DEFAULT_PRODUCTS_VERSION = "5";
const DEFAULT_PRODUCTS_MIN_VERSION = "3";
const DEFAULT_PRODUCT_DETAIL_VERSION = "7";
const DEFAULT_PRODUCT_DETAIL_MIN_VERSION = "4";

export async function ingestCdrInstitution(
  institution: InstitutionConfig,
  options?: {
    fetchImpl?: typeof fetch;
    useFixtureData?: boolean;
    category?: string;
  }
): Promise<IngestionRunResult> {
  if (!institution.cdrBaseUrl) {
    throw new Error(`Institution ${institution.id} is missing cdrBaseUrl.`);
  }

  const fetchImpl = options?.fetchImpl ?? fetch;
  const warnings: string[] = [];
  const snapshots: RawSourceSnapshot[] = [];
  const baseUrl = institution.cdrBaseUrl.replace(/\/$/, "");
  const listResponse = options?.useFixtureData
    ? sampleCdrProductList
    : await fetchAllProducts(fetchImpl, baseUrl, options?.category);

  snapshots.push({
    institutionId: institution.id,
    sourceKind: "cdr",
    fetchedAt: new Date().toISOString(),
    sourceUrl: `${baseUrl}/banking/products`,
    payload: listResponse
  });

  const details: CdrProductDetail[] = [];

  for (const product of listResponse.data.products) {
    const detailResponse = options?.useFixtureData
      ? sampleCdrProductDetails[product.productId]
      : await fetchProductDetail(fetchImpl, baseUrl, product.productId);

    if (!detailResponse) {
      warnings.push(`No detail response available for product ${product.productId}.`);
      continue;
    }

    snapshots.push({
      institutionId: institution.id,
      sourceKind: "cdr",
      fetchedAt: new Date().toISOString(),
      sourceUrl: `${baseUrl}/banking/products/${product.productId}`,
      payload: detailResponse
    });
    details.push(detailResponse.data);
  }

  return {
    institution,
    products: details.map((detail) =>
      normalizeCdrProduct(
        institution,
        detail,
        snapshots.filter((snapshot) =>
          JSON.stringify(snapshot.payload).includes(detail.productId)
        )
      )
    ),
    snapshots,
    warnings
  };
}

async function fetchAllProducts(
  fetchImpl: typeof fetch,
  baseUrl: string,
  category?: string
) {
  let nextUrl: string | null = buildProductsUrl(baseUrl, category);
  let firstPage: CdrProductListResponse | null = null;
  const allProducts: CdrProductListResponse["data"]["products"] = [];

  while (nextUrl) {
    const response = await fetchImpl(nextUrl, {
      headers: {
        Accept: "application/json",
        "x-v": DEFAULT_PRODUCTS_VERSION,
        "x-min-v": DEFAULT_PRODUCTS_MIN_VERSION
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch CDR products: ${response.status} ${response.statusText}`
      );
    }

    const page = (await response.json()) as CdrProductListResponse;
    firstPage ??= page;
    allProducts.push(...page.data.products);
    nextUrl = page.links?.next ?? null;
  }

  return {
    data: {
      products: allProducts
    },
    links: {},
    meta: firstPage?.meta
  } satisfies CdrProductListResponse;
}

function buildProductsUrl(baseUrl: string, category?: string) {
  const url = new URL(`${baseUrl}/banking/products`);

  if (category) {
    url.searchParams.set("product-category", category);
  }

  url.searchParams.set("effective", "CURRENT");
  url.searchParams.set("page-size", "100");

  return url.toString();
}

async function fetchProductDetail(
  fetchImpl: typeof fetch,
  baseUrl: string,
  productId: string
) {
  const response = await fetchImpl(`${baseUrl}/banking/products/${productId}`, {
    headers: {
      Accept: "application/json",
      "x-v": DEFAULT_PRODUCT_DETAIL_VERSION,
      "x-min-v": DEFAULT_PRODUCT_DETAIL_MIN_VERSION
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CDR product detail for ${productId}: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as CdrProductDetailResponse;
}
