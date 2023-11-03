import fetch from 'node-fetch';

const getTermEmbeddings = async (query) => {
    const apiKey = process.env.EMBEDDING_KEY;
    const url = `https://us-central1-projectphoenix-verteximage.cloudfunctions.net/getEmbeddings/embeddings?apikey=${apiKey}&arg=${query}`;

    const response = await fetch(url).then((res) => res.json());

    return response;
};

export default getTermEmbeddings;
