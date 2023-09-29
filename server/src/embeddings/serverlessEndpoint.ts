import fetch from "node-fetch";

const getTermEmbeddings = async (query) => {
  const url = `https://us-east-1.aws.data.mongodb-api.com/app/vectorsearchmovies-oozqp/endpoint/getDemoEmbeddings?apikey=developerday&arg=${query}`;

  let response = await fetch(url).then((res) => res.json());

  return response;
};

export default getTermEmbeddings;
