
type CacheEntry<T> = {
  expiresAt: number;
  data: T;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();
const inflightStore = new Map<string, Promise<unknown>>();

export function clearRequestCache(key?: string) {
  if (key) {
    cacheStore.delete(key);
    inflightStore.delete(key);
    return;
  }
  cacheStore.clear();
  inflightStore.clear();
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 2 * 60 * 1000 
): Promise<T> {
  const now = Date.now();

  const cached = cacheStore.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const inflight = inflightStore.get(key) as Promise<T> | undefined;
  if (inflight) {
    return inflight;
  }

  const promise = (async () => {
    try {
      const result = await fetcher();
      cacheStore.set(key, { data: result, expiresAt: now + ttlMs });
      return result;
    } finally {
      inflightStore.delete(key);
    }
  })();

  inflightStore.set(key, promise);
  return promise;
}


export async function fetchImmediate<T>(
  fetcher: () => Promise<T>
): Promise<T> {
  return await fetcher();
}


