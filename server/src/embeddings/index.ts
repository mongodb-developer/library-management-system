import getOpenAiEmbeddings from './openai.js';
import getVertexEmbeddings from './googleVertex.js';
import getServerlessEndpointEmbeddings from './serverlessEndpoint.js';
import getSageMakerEndpointEmbeddings from './sagemaker.js';

const EMBEDDINGS_SOURCE = process.env.EMBEDDINGS_SOURCE || 'openai';

async function getTermEmbeddings(query) {
    switch (EMBEDDINGS_SOURCE) {
    case 'openai':
        return await getOpenAiEmbeddings(query);
    case 'googleVertex':
        return await getVertexEmbeddings(query);
    case 'serverlessEndpoint':
        return await getServerlessEndpointEmbeddings(query);
    case 'sagemaker':
        return await getSageMakerEndpointEmbeddings(query);
    default:
        return await getOpenAiEmbeddings(query);
    }
}

export default getTermEmbeddings;