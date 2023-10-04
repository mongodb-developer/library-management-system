import OpenAI from 'openai';

const { EMBEDDING_KEY } = process.env;

let openai;

const getTermEmbeddings = async (text) => {
    if (!openai) {
        openai = new OpenAI({apiKey: EMBEDDING_KEY});
    }
    const embeddings = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    return embeddings?.data[0]?.embedding;
};

export default getTermEmbeddings;