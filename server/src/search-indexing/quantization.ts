import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

/**
 * Create the Vector Search index with scalar quantization.
 */
await collection.createSearchIndex({
    name: 'vectorsearch-quantized',
    type: 'vectorSearch',
    definition: {
        fields: [
            {
                type: 'vector',
                path: 'embeddings',
                numDimensions: 1408,
                similarity: 'cosine',
// -----------------------------------------------------------------------------------------------
// <----------- REPLACE THE PLACEHOLDER BELOW WITH TYPE OF QUANTIZATION TO USE ------------------>
// -----------------------------------------------------------------------------------------------
                quantization: '<TYPE_OF_QUANTIZATION_TO_USE>'
            },
            {
                type: 'filter',
                path: 'year'
            },
            {
                type: 'filter',
                path: 'language'
            }
        ]
    }
});

const result = await collection.listSearchIndexes().toArray();
console.log('Search indexes on the books collection:');
console.log(result);

await client.close();
process.exit();
