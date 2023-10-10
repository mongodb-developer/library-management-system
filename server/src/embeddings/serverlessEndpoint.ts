import fetch from 'node-fetch';

const getTermEmbeddings = async (query) => {
    const url = `https://us-east-1.aws.data.mongodb-api.com/app/vectorsearchserverless-ruksj/endpoint/embeddings?apikey=devday&arg=${query}`;

    const response = await fetch(url).then((res) => res.json());

    return response;
};

export default getTermEmbeddings;
