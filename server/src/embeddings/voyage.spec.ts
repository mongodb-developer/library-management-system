import assert from 'assert';
import getVoyageEmbeddings, { VOYAGE_EMBEDDING_DIMENSIONS } from './voyage.js';

describe('Voyage embeddings', () => {
    const originalFetch = globalThis.fetch;
    const originalPasskey = process.env.PASSKEY;
    const originalProxyEndpoint = process.env.PROXY_ENDPOINT;
    const originalApiKey = process.env.VOYAGE_API_KEY;
    const requests: Array<{ url: string; body: Record<string, unknown> }> = [];

    before(() => {
        process.env.PASSKEY = 'test-passkey';
        process.env.PROXY_ENDPOINT = 'https://proxy.test';
        delete process.env.VOYAGE_API_KEY;

        globalThis.fetch = async (input, init) => {
            const url = String(input);
            const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
            requests.push({ url, body });

            if (url === process.env.PROXY_ENDPOINT) {
                return new Response(JSON.stringify({
                    token: { VOYAGE_API_KEY: 'test-voyage-key' }
                }), { status: 200 });
            }

            return new Response(JSON.stringify({
                data: [{
                    index: 0,
                    embedding: Array(VOYAGE_EMBEDDING_DIMENSIONS).fill(0.25)
                }]
            }), { status: 200 });
        };
    });

    after(() => {
        globalThis.fetch = originalFetch;
        if (originalPasskey === undefined) {
            delete process.env.PASSKEY;
        } else {
            process.env.PASSKEY = originalPasskey;
        }
        if (originalProxyEndpoint === undefined) {
            delete process.env.PROXY_ENDPOINT;
        } else {
            process.env.PROXY_ENDPOINT = originalProxyEndpoint;
        }
        if (originalApiKey === undefined) {
            delete process.env.VOYAGE_API_KEY;
        } else {
            process.env.VOYAGE_API_KEY = originalApiKey;
        }
    });

    it('gets a Voyage key with the passkey and requests a query vector', async () => {
        const embedding = await getVoyageEmbeddings('romantic stories set in Europe');

        assert.strictEqual(embedding.length, VOYAGE_EMBEDDING_DIMENSIONS);
        assert.strictEqual(requests.length, 2);
        assert.deepStrictEqual(requests[0].body, {
            task: 'get_token',
            data: {
                passkey: 'test-passkey',
                providers: ['voyageai']
            }
        });
        assert.strictEqual(requests[1].url, 'https://ai.mongodb.com/v1/embeddings');
        assert.deepStrictEqual(requests[1].body, {
            model: 'voyage-4-lite',
            input: ['romantic stories set in Europe'],
            input_type: 'query',
            output_dimension: VOYAGE_EMBEDDING_DIMENSIONS
        });
    });
});
