import { sampleWebsiteHtml } from "@/lib/ingestion/fixtures";
import { normalizeWebsiteProduct } from "@/lib/ingestion/normalize";
import type {
  IngestionRunResult,
  InstitutionConfig,
  RawSourceSnapshot
} from "@/lib/ingestion/types";

export async function ingestWebsiteInstitution(
  institution: InstitutionConfig,
  options?: {
    fetchImpl?: typeof fetch;
    useFixtureData?: boolean;
  }
): Promise<IngestionRunResult> {
  if (!institution.websiteUrl || !institution.selectors) {
    throw new Error(`Institution ${institution.id} is missing website ingestion config.`);
  }

  const html = options?.useFixtureData
    ? sampleWebsiteHtml
    : await fetchWebsiteHtml(options?.fetchImpl ?? fetch, institution.websiteUrl);
  const snapshots: RawSourceSnapshot[] = [
    {
      institutionId: institution.id,
      sourceKind: "website",
      fetchedAt: new Date().toISOString(),
      sourceUrl: institution.websiteUrl,
      payload: html
    }
  ];

  const extracted = extractWebsiteProducts(html, institution.selectors);

  return {
    institution,
    products: extracted.map((product, index) =>
      normalizeWebsiteProduct({
        institution,
        externalId: `${institution.id}-website-${index + 1}`,
        name: product.name,
        summary: product.summary,
        rateLabel: product.rateLabel,
        feeLabel: product.feeLabel,
        applicationUrl: product.applicationUrl,
        snapshots
      })
    ),
    snapshots,
    warnings:
      extracted.length === 0
        ? ["No products matched the configured website selectors."]
        : []
  };
}

async function fetchWebsiteHtml(fetchImpl: typeof fetch, url: string) {
  const response = await fetchImpl(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch website source ${url}: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

function extractWebsiteProducts(
  html: string,
  selectors: InstitutionConfig["selectors"]
) {
  if (!selectors) {
    return [];
  }

  const cardBlocks = html.match(/<section[\s\S]*?<\/section>/gi) ?? [];

  return cardBlocks
    .map((block) => {
      const name = getAttrText(block, selectors.name);
      if (!name) {
        return null;
      }

      return {
        name,
        summary: getAttrText(block, selectors.summary) ?? "Website product summary pending review.",
        rateLabel: getAttrText(block, selectors.rate) ?? "Rate pending review",
        feeLabel: getAttrText(block, selectors.fee) ?? "Fee pending review",
        applicationUrl: getLink(block)
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function getAttrText(block: string, selector?: string) {
  if (!selector) {
    return undefined;
  }

  const dataAttrMatch = selector.match(/\[data-([\w-]+)\]/);
  if (!dataAttrMatch) {
    return undefined;
  }

  const attrName = dataAttrMatch[1];
  const regex = new RegExp(
    `<[^>]+data-${escapeRegex(attrName)}[^>]*>([\\s\\S]*?)<\\/[^>]+>`,
    "i"
  );
  const match = block.match(regex);

  return match?.[1].replace(/<[^>]+>/g, "").trim();
}

function getLink(block: string) {
  const match = block.match(/<a[^>]+href="([^"]+)"/i);
  return match?.[1];
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
