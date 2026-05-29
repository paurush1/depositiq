import { ingestCdrInstitution } from "@/lib/ingestion/cdr";
import { discoverInstitutionConfigs } from "@/lib/ingestion/register";
import { getInstitutionById, institutionConfigs } from "@/lib/ingestion/providers";
import { ingestWebsiteInstitution } from "@/lib/ingestion/website";
import type { IngestionRunResult, InstitutionConfig } from "@/lib/ingestion/types";

export async function runIngestion(options?: {
  institutionId?: string;
  useFixtureData?: boolean;
  brandQuery?: string;
  liveRegisterDiscovery?: boolean;
  limit?: number;
}) {
  const institutions = options?.institutionId
    ? [getRequiredInstitution(options.institutionId)]
    : options?.liveRegisterDiscovery
      ? await discoverInstitutionConfigs({
          brandQuery: options.brandQuery,
          limit: options.limit
        })
      : institutionConfigs;

  const runs: IngestionRunResult[] = [];

  for (const institution of institutions) {
    try {
      runs.push(await runInstitutionIngestion(institution, options?.useFixtureData));
    } catch (error) {
      runs.push({
        institution,
        products: [],
        snapshots: [],
        warnings: [],
        error: error instanceof Error ? error.message : "Unknown ingestion error"
      });
    }
  }

  return runs;
}

async function runInstitutionIngestion(
  institution: InstitutionConfig,
  useFixtureData?: boolean
) {
  if (institution.kind === "cdr") {
    return ingestCdrInstitution(institution, {
      useFixtureData
    });
  }

  return ingestWebsiteInstitution(institution, {
    useFixtureData
  });
}

function getRequiredInstitution(institutionId: string) {
  const institution = getInstitutionById(institutionId);

  if (!institution) {
    throw new Error(`Unknown institution id: ${institutionId}`);
  }

  return institution;
}
