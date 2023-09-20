import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const URI = process.env.DATABASE_URI;
const client = new MongoClient(URI);
await client.connect();
console.log('Connected successfully to the database');

const db = client.db('library');
const collection = db.collection('books');

const books = await collection.find().toArray();

const batchSize = 5000;
let i = 0;
while (i < books.length - 1) {
    const updates = [];
    for (let j = i; j < i + batchSize; j++) {
        const book = books[j];
        if (book) {
            const update = await migrate(book);
            updates.push(update);
        }
    }

    const result = await collection.bulkWrite(updates);
    console.log(result);
    i = i + batchSize;
}

async function migrate(book) {
    if (!book) {
        return;
    }

    const attributes = book?.attributes || [];
    const setFields = {
        'attributes': attributes
    };

    // Move publisher to a top-level field
    const publisherIndex = attributes.findIndex((attr) => attr.key === 'publisher');
    const publisher = attributes[publisherIndex]?.value;
    if (publisher) {
        setFields['publisher'] = publisher;
        attributes.splice(publisherIndex, 1);
    }

    // Move binding to a top-level field
    const bindingIndex = attributes.findIndex((attr) => attr.key === 'binding');
    const binding = attributes[bindingIndex]?.value;
    if (binding) {
        setFields['binding'] = binding;
        attributes.splice(bindingIndex, 1);
    }

    // Move language to a top-level field
    const languageIndex = attributes.findIndex((attr) => attr.key === 'language');
    const language = attributes[languageIndex]?.value;
    if (language) {
        setFields['language'] = language;
        attributes.splice(languageIndex, 1);
    }

    // Move title_long to a top-level field 'longTitle'
    const titleLongIndex = attributes.findIndex((attr) => attr.key === 'title_long');
    const titleLong = attributes[titleLongIndex]?.value;
    if (titleLong) {
        setFields['longTitle'] = titleLong;
        attributes.splice(titleLongIndex, 1);
    }

    // Delete subjects from attributes
    const subjectsIndex = attributes.findIndex((attr) => attr.key === 'subjects');
    if (subjectsIndex !== -1) {
        attributes.splice(subjectsIndex, 1);
    }

    // Delete image from attributes
    const imageIndex = attributes.findIndex((attr) => attr.key === 'image');
    if (imageIndex !== -1) {
        attributes.splice(imageIndex, 1);
    }

    // Delete date_published from attributes
    const datePublishedIndex = attributes.findIndex((attr) => attr.key === 'date_published');
    if (datePublishedIndex !== -1) {
        attributes.splice(datePublishedIndex, 1);
    }

    // Delete authors from attributes
    const authorsIndex = attributes.findIndex((attr) => attr.key === 'authors');
    if (authorsIndex !== -1) {
        attributes.splice(authorsIndex, 1);
    }

    // Delete title from attributes
    const titleIndex = attributes.findIndex((attr) => attr.key === 'title');
    if (titleIndex !== -1) {
        attributes.splice(titleIndex, 1);
    }

    // Delete pages from attributes
    const pagesIndex = attributes.findIndex((attr) => attr.key === 'pages');
    if (pagesIndex !== -1) {
        attributes.splice(pagesIndex, 1);
    }

    // Delete synopsis from attributes
    const synopsisIndex = attributes.findIndex((attr) => attr.key === 'synopsis');
    if (synopsisIndex !== -1) {
        attributes.splice(synopsisIndex, 1);
    }

    // Fix top-level synopsis -> remove <p> tags
    let synopsis = book?.synopsis;
    if (synopsis) {
        synopsis = synopsis.replaceAll('<p>', '');
        synopsis = synopsis.replaceAll('</p>', '');
        setFields['synopsis'] = synopsis;
    }

    const update = {
        updateOne: {
            filter: {
                _id: book._id
            },
            update: {
                $set: setFields,
            }
        }
    }

    return update;
}
 
await client.close();