import '../load-env-vars.js';
import { connectToDatabase, databases } from '../database.js';

const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
await connectToDatabase(DATABASE_URI);
const db = databases.library;
console.log('Connected!\n');

console.log('Disabling schema validation...');
await db.command({
    collMod: 'users',
    validator: {},
    validationLevel: 'off'
});

await db.command({
    collMod: 'authors',
    validator: {},
    validationLevel: 'off'
});

console.log('Disabled');
process.exit(0);
