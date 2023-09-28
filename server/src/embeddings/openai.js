import OpenAI from 'openai';

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({apiKey: OPENAI_API_KEY});

const getTermEmbeddings = async (text) => {
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return embeddings?.data[0]?.embedding;
}

export default getTermEmbeddings;