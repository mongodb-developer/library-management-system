import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

await collection.updateSearchIndex(
    'vectorsearch',
    {
        fields: [
            {
                type: 'vector',
                path: 'embeddings',
                numDimensions: 1408,
                similarity: 'cosine',
                quantization: 'scalar'
            },
            {
                type: 'filter',
                path: 'year'
            },
            {
                type: 'filter',
                path: 'language'
            }
        ],

    }
);

const result = await collection.listSearchIndexes().toArray();
console.log('Search indexes on the books collection:');
console.log(result);

await client.close();
process.exit();
