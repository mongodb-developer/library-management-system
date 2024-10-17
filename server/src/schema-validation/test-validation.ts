import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';

const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

try {
    // eslint-disable-next-line
    await collections?.users?.insertOne(<any>{
        Name: 'cb',
        IsAdmin: 1
    });
}
catch (error) {
    console.log(error.message);
    for (const validationMessage of error.errInfo.details.schemaRulesNotSatisfied) {
        console.log(validationMessage);
    }
}

process.exit(1);

