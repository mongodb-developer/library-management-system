import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
import { readSearchIndexVersion, waitForSearchIndex } from './wait-for-search-index.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;
const name = 'fulltextsearch';

try {
    const afterVersion = await readSearchIndexVersion(collection, name);
    await collection.updateSearchIndex(name, {
        'mappings': {
            'dynamic': false,
            'fields': {
                'authors': {
                    'type': 'document',
                    'fields': {
                        'name': {
                            'type': 'string'
                        }
                    }
                },
                'genres': {
                    'type': 'string'
                },
                'title': {
                    'type': 'string'
                }
            }
        }
    });
    await waitForSearchIndex(collection, name, { afterVersion });
} finally {
    await client.close();
}
