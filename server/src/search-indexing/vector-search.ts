import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
import { waitForSearchIndex } from './wait-for-search-index.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

/**
 * Create the MongoDB Vector Search index.
 * The index definition specifies the field that contains the vector embeddings,
 * the number of dimensions in the vectors
 * and the similarity metric to use for searching.
 */
await collection.createSearchIndex({
    name: 'vectorsearch',
    // -----------------------------------------------------------------------------------------------
    // <----------- REPLACE THE PLACEHOLDER BELOW WITH THE CORRECT INDEX TYPE ----------------------->
    // -----------------------------------------------------------------------------------------------
    type: '<REPLACE_WITH_INDEX_TYPE>',
    definition: {
        fields: [
            {
                type: 'vector',
                // -----------------------------------------------------------------------------------------------
                // <----------- REPLACE THE PLACEHOLDER BELOW WITH PATH TO THE VECTOR FIELD --------------------->
                // -----------------------------------------------------------------------------------------------
                path: '<REPLACE_WITH_PATH_TO_VECTOR_FIELD>',
                numDimensions: 1024,
                similarity: 'cosine'
            }
        ]
    }
}).then(name => waitForSearchIndex(collection, name))
    .finally(() => client.close());
