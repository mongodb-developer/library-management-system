import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';

const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

try {
    // eslint-disable-next-line
    await collections?.users?.insertOne(<any>{
        age: 25
    });
}
catch (error) {
    console.log(error.message);
    for (const validationMessage of error.errInfo.details.schemaRulesNotSatisfied) {
        console.log(validationMessage);
    }
}

process.exit(1);

// import '../load-env-vars.js';
// import { connectToDatabase, collections } from '../database.js';

// const { DATABASE_URI } = process.env;

// console.log('Connecting to MongoDB Atlas...');
// await connectToDatabase(DATABASE_URI);
// console.log('Connected!\n');

// try {
//     // Insert an invalid document into the authors collection
//     await collections?.authors?.insertOne(<any>{
//         name: 'A' // This should fail due to the minLength rule
//     });
// } catch (error) {
//     console.log(error.message);
//     if (error.errInfo && error.errInfo.details && error.errInfo.details.schemaRulesNotSatisfied) {
//         for (const validationMessage of error.errInfo.details.schemaRulesNotSatisfied) {
//             console.log(validationMessage);
//         }
//     }
// }

// process.exit(1);
