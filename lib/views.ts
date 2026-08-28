import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

type ViewCounts = Record<string, number>;

const viewCountFile = process.env.VIEW_COUNT_FILE ?? path.join(process.cwd(), "data", "views.json");
let mutationQueue: Promise<void> = Promise.resolve();

async function readCounts(): Promise<ViewCounts> {
  try {
    const value = JSON.parse(await readFile(viewCountFile, "utf8")) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    return Object.fromEntries(
      Object.entries(value).filter((entry): entry is [string, number] =>
        Number.isSafeInteger(entry[1]) && entry[1] >= 0
      )
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function writeCounts(counts: ViewCounts) {
  const directory = path.dirname(viewCountFile);
  const temporaryFile = `${viewCountFile}.${process.pid}.tmp`;
  await mkdir(directory, { recursive: true });
  await writeFile(temporaryFile, `${JSON.stringify(counts, null, 2)}\n`, { mode: 0o600 });
  await rename(temporaryFile, viewCountFile);
}

export async function getViewCount(slug: string) {
  await mutationQueue;
  return (await readCounts())[slug] ?? 0;
}

export function incrementViewCount(slug: string) {
  const operation = mutationQueue.then(async () => {
    const counts = await readCounts();
    const count = (counts[slug] ?? 0) + 1;
    counts[slug] = count;
    await writeCounts(counts);
    return count;
  });

  mutationQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
