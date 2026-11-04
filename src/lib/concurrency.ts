/**
 * Run async work with a small concurrency limit.
 *
 * The API has a per-user burst limit; firing one request per lesson at once
 * (for a 35-lesson subject, plus files/topics) causes some requests to be
 * rate-limited and silently treated as empty by the pages.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
  delayMs = 0
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) return;
      results[index] = await fn(items[index], index);
      if (delayMs > 0 && nextIndex < items.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  const workerCount = Math.min(Math.max(1, limit), items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
