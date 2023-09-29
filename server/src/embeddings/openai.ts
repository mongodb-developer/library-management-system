import OpenAI from 'openai';

const { OPENAI_API_KEY } = process.env;

let openai;

const getTermEmbeddings = async (text) => {
    if (!openai) {
        openai = new OpenAI({apiKey: OPENAI_API_KEY});
    }
    const embeddings = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    return embeddings?.data[0]?.embedding;
};

export default getTermEmbeddings;