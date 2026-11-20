import getOpenAiEmbeddings from './openai.js';
import getVertexEmbeddings from './googleVertex.js';
import getServerlessEndpointEmbeddings from './serverlessEndpoint.js';
import getVoyageEmbeddings from './voyage.js';

const EMBEDDINGS_SOURCE = process.env.EMBEDDINGS_SOURCE || 'serverlessEndpoint';

async function getTermEmbeddings(query) {
    switch (EMBEDDINGS_SOURCE) {
    case 'openai':
        return await getOpenAiEmbeddings(query);
    case 'googleVertex':
        return await getVertexEmbeddings(query);
    case 'serverlessEndpoint':
        return await getServerlessEndpointEmbeddings(query);
    case 'voyage':
        return await getVoyageEmbeddings(query);
    default:
        return await getOpenAiEmbeddings(query);
    }
}

export default getTermEmbeddings;