import fetch from 'node-fetch';

const getSageMakerEndpointEmbeddings = async (query: string) => {
    const key = process.env.API_KEY;
    if (!key) {
        throw new Error('API key is not defined. Please define it in the .env file.');
    }

    const headers = {
        'x-api-key': key,
    };

    const url = `https://mg6odsln17.execute-api.us-east-1.amazonaws.com/default/searchLabSageMakerEndpoint?query=${query}`;

    const response = await fetch(url, {
        method: 'GET',
        headers,
    }).then((res) => res.json());

    const embedding = response?.embedding;
    if (!embedding) {
        throw new Error('Failed to generate SageMaker embedding');
    }

    return embedding;
};

export default getSageMakerEndpointEmbeddings;
