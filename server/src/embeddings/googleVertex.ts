import aiplatform, { helpers } from '@google-cloud/aiplatform';

/**
 * GOOGLE_APPLICATION_CREDENTIALS should point to your authentication file
 * PROJECT_ID is the name of your project in Google Cloud
 * PROJECT_LOCATION region where your project is located
 */

const project = process.env.PROJECT_ID;
const location = process.env.PROJECT_LOCATION;
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.EMBEDDING_KEY) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.EMBEDDING_KEY;
}

const { PredictionServiceClient } = aiplatform.v1;
const predictionServiceClient = new PredictionServiceClient({
    apiEndpoint: 'us-central1-aiplatform.googleapis.com'
});

const getTermEmbeddings = async (text: string) => {
    const publisher = 'google';
    const model = 'multimodalembedding@001';

    // Configure the parent resource
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

    const instance = { text };
    const instanceValue = helpers.toValue(instance);
    const instances = [instanceValue];

    const request = {
        endpoint,
        instances
    };

    // Predict request
    const [response] = await predictionServiceClient.predict(request);
    const embeddings = response.predictions[0].structValue.fields.textEmbedding.listValue.values.map(e => e.numberValue);

    return embeddings;
};

export default getTermEmbeddings;
