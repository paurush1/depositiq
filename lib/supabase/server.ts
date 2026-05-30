function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function hasSupabaseServerEnv() {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

export async function supabaseRestRequest<T>(args: {
  path: string;
  method?: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  prefer?: string;
}): Promise<T> {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const endpoint = new URL(`/rest/v1/${args.path}`, url);

  for (const [queryKey, queryValue] of Object.entries(args.query ?? {})) {
    if (queryValue !== undefined) {
      endpoint.searchParams.set(queryKey, String(queryValue));
    }
  }

  const response = await fetch(endpoint, {
    method: args.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(args.prefer ? { Prefer: args.prefer } : {})
    },
    body: args.body === undefined ? undefined : JSON.stringify(args.body),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase REST error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
