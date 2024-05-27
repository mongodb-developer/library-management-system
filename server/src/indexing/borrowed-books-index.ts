import '../load-env-vars.js';
import { connectToDatabase, collections } from '../database.js';
import { BorrowedBook } from '../models/issue-detail.js';
import { ObjectId } from 'mongodb';

const { DATABASE_URI } = process.env;

console.log('Connecting to MongoDB Atlas...');
const client = await connectToDatabase(DATABASE_URI);
console.log('Connected!\n');

console.log('BEFORE creating the index\n');
await explainBorrowedBooksQuery();

/**
 * Create the index to support the following query:
 * issueDetails.find({
 *    'user._id': userID,
 *   borrowDate: { $gte: date },
 * }, {
 *  sort: { returnedDate: -1 }
 * })
 */
await collections?.issueDetails?.createIndex({
    // Equality
    'user._id': 1,
    // Sort
    returnedDate: 1,
    // Range
    borrowDate: 1,
});

console.log('\n-----------------------------\n');
console.log('AFTER creating the index\n');
await explainBorrowedBooksQuery();

await collections?.issueDetails?.dropIndexes();
await client.close();
process.exit();

async function explainBorrowedBooksQuery() {
    /**
     * Find all books that have been borrowed by the user with the specified ID since April this year.
     * Sort the results by the date they were returned in descending order.
     */
    const explainPlan = await collections?.issueDetails?.find<BorrowedBook>({
        'user._id': new ObjectId('65133d20e861a187094672a7'),
        borrowDate: { $gte: new Date('2024-04-01') }
    }, {
        sort: { returnedDate: -1 }
    }).explain();

    const inputStage = explainPlan.queryPlanner.winningPlan.inputStage;
    console.log(`Winning plan stage: ${inputStage.stage}`);
    
    const index = inputStage.indexName;
    console.log(index ? `Index used: ${index}` : 'No index used');

    console.log(`Total documents examined: ${explainPlan.executionStats.totalDocsExamined}`);
    console.log(`Number of documents returned: ${explainPlan.executionStats.nReturned}`);
}
