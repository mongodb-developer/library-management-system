import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

/**
 * Create the Vector Search index.
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
                numDimensions: 1408,
                similarity: 'cosine'
            }
        ]
    }
});

const result = await collection.listSearchIndexes().toArray();
console.log('Search indexes on the books collection:');
console.log(result);

await client.close();
process.exit();
