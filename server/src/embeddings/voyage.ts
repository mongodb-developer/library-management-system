type InputType = 'query' | 'document';

type VoyageResponse = {
    data?: Array<{
        index: number;
        embedding: number[];
    }>;
};

const VOYAGE_API_URL = 'https://ai.mongodb.com/v1/embeddings';
export const VOYAGE_MODEL = 'voyage-4-lite';
export const VOYAGE_EMBEDDING_DIMENSIONS = 1024;

let cachedApiKey: string | undefined;
let apiKeyRequest: Promise<string> | undefined;

async function requestApiKey(): Promise<string> {
    const apiKey = process.env.VOYAGE_API_KEY;
    if (apiKey) {
        return apiKey;
    }

    if (!process.env.PASSKEY) {
        throw new Error('PASSKEY is required to retrieve a Voyage API key.');
    }

    if (!process.env.PROXY_ENDPOINT) {
        throw new Error('PROXY_ENDPOINT is required to retrieve a Voyage API key.');
    }

    const response = await fetch(process.env.PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            task: 'get_token',
            data: {
                passkey: process.env.PASSKEY,
                providers: ['voyageai']
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Voyage credential request failed with status ${response.status}.`);
    }

    const result = await response.json() as { token?: Record<string, string> };
    const token = result.token?.VOYAGE_API_KEY;
    if (!token) {
        throw new Error('Voyage credential response did not contain VOYAGE_API_KEY.');
    }

    return token;
}

async function getApiKey(): Promise<string> {
    if (process.env.VOYAGE_API_KEY) {
        return process.env.VOYAGE_API_KEY;
    }

    if (cachedApiKey) {
        return cachedApiKey;
    }

    if (!apiKeyRequest) {
        apiKeyRequest = requestApiKey();
    }

    try {
        cachedApiKey = await apiKeyRequest;
        return cachedApiKey;
    } catch (error) {
        apiKeyRequest = undefined;
        throw error;
    }
}

export async function getVoyageEmbeddingsBatch(
    texts: string[],
    inputType: InputType
): Promise<number[][]> {
    if (texts.length === 0) {
        return [];
    }

    if (texts.some(text => !text.trim())) {
        throw new Error('Voyage embedding inputs must not be empty.');
    }

    const apiKey = await getApiKey();
    const response = await fetch(VOYAGE_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: VOYAGE_MODEL,
            input: texts,
            input_type: inputType,
            output_dimension: VOYAGE_EMBEDDING_DIMENSIONS
        })
    });

    if (!response.ok) {
        throw new Error(`Voyage embedding request failed with status ${response.status}.`);
    }

    const result = await response.json() as VoyageResponse;
    if (!Array.isArray(result.data) || result.data.length !== texts.length) {
        throw new Error('Voyage embedding response did not contain one vector per input.');
    }

    const data = [...result.data].sort((left, right) => left.index - right.index);
    return data.map((item, index) => {
        if (item.index !== index) {
            throw new Error('Voyage embedding response indexes were incomplete or duplicated.');
        }

        if (
            !Array.isArray(item.embedding) ||
            item.embedding.length !== VOYAGE_EMBEDDING_DIMENSIONS ||
            item.embedding.some(value => !Number.isFinite(value))
        ) {
            throw new Error(`Voyage returned an invalid ${VOYAGE_EMBEDDING_DIMENSIONS}-dimension vector.`);
        }

        return item.embedding;
    });
}

async function getVoyageEmbeddings(text: string, inputType: InputType = 'query'): Promise<number[]> {
    const [embedding] = await getVoyageEmbeddingsBatch([text], inputType);
    return embedding;
}

export default getVoyageEmbeddings;
