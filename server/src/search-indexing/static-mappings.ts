import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

const collection = collections?.books;

await collection.updateSearchIndex(
    'fulltextsearch',
    {
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
    }
);

const result = await collection.listSearchIndexes().toArray();
console.log('Search indexes on the books collection:');
console.log(result);

await client.close();
process.exit();
