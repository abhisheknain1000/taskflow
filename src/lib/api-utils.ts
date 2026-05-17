export function unwrapApiData<T>(response: unknown): T {
  if (!response || typeof response !== "object") {
    return response as T;
  }

  const payload = response as { data?: T };
  return (payload.data ?? response) as T;
}
