import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
import { waitForSearchIndex } from './wait-for-search-index.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

/**
 * Create the MongoDB Vector Search index with prefiltering fields.
 */
await collection.createSearchIndex({
    name: 'vectorsearch-prefilter',
    type: 'vectorSearch',
    definition: {
        fields: [
            {
                type: 'vector',
                path: 'embeddings',
                numDimensions: 1024,
                similarity: 'cosine'
            },
            {
                type: 'filter',
                // -----------------------------------------------------------------------------------------------
                // <----------- REPLACE THE PLACEHOLDER BELOW WITH THE NAME OF THE YEAR FIELD IN YOUR DOCUMENTS ----------------------->
                // -----------------------------------------------------------------------------------------------
                path: '<REPLACE_WITH_YEAR_FIELD_NAME>'
            },
            {
                type: 'filter',
                // -----------------------------------------------------------------------------------------------
                // <----------- REPLACE THE PLACEHOLDER BELOW WITH THE NAME OF THE LANGUAGE FIELD IN YOUR DOCUMENTS ------------------>
                // -----------------------------------------------------------------------------------------------
                path: '<REPLACE_WITH_LANGUAGE_FIELD_NAME>'
            }
        ]
    }
}).then(name => waitForSearchIndex(collection, name))
    .finally(() => client.close());
