import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

/**
 * Create the Atlas Search index with dynamic mappings.
 * Atlas will automatically infer the field types based on the data in the documents.
 * Dynamic mappings are useful when you're just getting started with Atlas Search or if your schema changes regularly.
 * However, they take up more space compared to static mappings.
 */
await collection.createSearchIndex({
    name: 'default',
    definition: {
        mappings: {
            dynamic: true
        }
    }
});

const result = await collection.listSearchIndexes().toArray();
console.log('Search indexes on the books collection:');
console.log(result);

await client.close();
process.exit();
