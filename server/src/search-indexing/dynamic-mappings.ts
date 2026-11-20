import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
import { waitForSearchIndex } from './wait-for-search-index.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

/**
 * Create the MongoDB Search index with dynamic mappings.
 * Dynamic mappings are useful when your schema changes regularly or when getting started.
 * However, they take up more space compared to static mappings.
 */
await collection.createSearchIndex({
    name: 'fulltextsearch',
    definition: {
        mappings: {
            dynamic: true
        }
    }
}).then(name => waitForSearchIndex(collection, name))
    .finally(() => client.close());
