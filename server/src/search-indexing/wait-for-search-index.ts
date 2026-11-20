import { setTimeout as delay } from 'node:timers/promises';
import type { Collection } from 'mongodb';

interface SearchIndexStatus {
    status: string;
    queryable: boolean;
    latestVersion?: number;
    latestDefinitionVersion?: { version: number };
}

type SearchIndexCollection = Pick<Collection, 'aggregate'>;

async function readSearchIndex(collection: SearchIndexCollection, name: string, timeoutMS: number) {
    const [index] = await collection.aggregate<SearchIndexStatus>(
        [{ $listSearchIndexes: { name } }],
        { timeoutMS }
    ).toArray();
    return index;
}

function indexVersion(index?: SearchIndexStatus): number | undefined {
    // Atlas Local returns latestVersion instead of latestDefinitionVersion.
    return index?.latestDefinitionVersion?.version ?? index?.latestVersion;
}

export async function readSearchIndexVersion(collection: SearchIndexCollection, name: string) {
    const index = await readSearchIndex(collection, name, 10_000);
    const version = indexVersion(index);
    if (index && version === undefined) {
        throw new Error(`Could not determine the current version of search index "${name}".`);
    }
    return version;
}

export async function waitForSearchIndex(
    collection: SearchIndexCollection,
    name: string,
    { afterVersion, timeoutMS = 120_000, pollIntervalMS = 5_000 }: {
        afterVersion?: number;
        timeoutMS?: number;
        pollIntervalMS?: number;
    } = {}
): Promise<void> {
    const deadline = performance.now() + timeoutMS;
    let lastStatus: string | undefined;

    while (performance.now() < deadline) {
        const remaining = Math.ceil(deadline - performance.now());
        const index = await readSearchIndex(collection, name, Math.max(1, remaining));
        const status = index ? `${index.status} (queryable: ${index.queryable})` : 'not listed yet';
        const currentVersion = indexVersion(index);
        const isCurrent = afterVersion === undefined || (currentVersion !== undefined && currentVersion > afterVersion);

        if (isCurrent && index?.status === 'READY' && index.queryable === true) {
            console.log(`${name}: ${status}`);
            return;
        }
        if (isCurrent && index?.status === 'FAILED') {
            throw new Error(`Search index "${name}" failed to build.`);
        }
        if (status !== lastStatus) {
            console.log(`Waiting for ${name}: ${status}`);
            lastStatus = status;
        }
        await delay(Math.min(pollIntervalMS, Math.max(0, deadline - performance.now())));
    }

    throw new Error(`Timed out waiting for search index "${name}" after ${timeoutMS / 1000}s. Last status: ${lastStatus ?? 'unknown'}.`);
}
