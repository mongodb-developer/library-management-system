import '../load-env-vars.js';
import { MongoClient } from 'mongodb';
import {
    getVoyageEmbeddingsBatch,
    VOYAGE_EMBEDDING_DIMENSIONS,
    VOYAGE_MODEL
} from './voyage.js';

type BookForMigration = {
    _id: string;
    title?: string;
    synopsis?: string;
};

const BATCH_SIZE = 32;
const STAGING_VECTOR_FIELD = 'voyageEmbeddingsStaging';
const STAGING_MODEL_FIELD = 'voyageEmbeddingsStagingModel';

function isValidVectorExpression(field: string) {
    return {
        $eq: [
            {
                $cond: [
                    { $isArray: `$${field}` },
                    { $size: `$${field}` },
                    0
                ]
            },
            VOYAGE_EMBEDDING_DIMENSIONS
        ]
    };
}

function getBookText(book: BookForMigration): string {
    const text = [book.title?.trim(), book.synopsis?.trim()]
        .filter((value): value is string => Boolean(value))
        .join('\n\n');

    if (!text) {
        throw new Error(`Book ${book._id} has no title or synopsis to embed.`);
    }

    return text;
}

const databaseUri = process.env.DATABASE_URI;
if (!databaseUri) {
    throw new Error('DATABASE_URI is required to generate Voyage embeddings.');
}

const client = new MongoClient(databaseUri);
await client.connect();

try {
    const books = client.db(process.env.DATABASE_NAME).collection<BookForMigration>('books');
    const total = await books.countDocuments();
    if (total === 0) {
        throw new Error('The books collection is empty; no Voyage embeddings were generated.');
    }

    const completed = await books.countDocuments({
        embeddingModel: VOYAGE_MODEL,
        $expr: isValidVectorExpression('embeddings')
    });

    if (completed === total) {
        console.log(`All ${total} books already have ${VOYAGE_MODEL} embeddings.`);
    } else {
        const batch: BookForMigration[] = [];

        const processBatch = async () => {
            if (batch.length === 0) {
                return;
            }

            const vectors = await getVoyageEmbeddingsBatch(batch.map(getBookText), 'document');
            await books.bulkWrite(batch.map((book, index) => {
                const vector = vectors[index];
                if (!vector) {
                    throw new Error(`Voyage returned no embedding for book ${book._id}.`);
                }

                return {
                    updateOne: {
                        filter: { _id: book._id },
                        update: {
                            $set: {
                                [STAGING_VECTOR_FIELD]: vector,
                                [STAGING_MODEL_FIELD]: VOYAGE_MODEL
                            }
                        }
                    }
                };
            }));

            console.log(`Generated embeddings for ${batch.length} books.`);
            batch.length = 0;
        };

        for await (const book of books.find().project<BookForMigration>({ _id: 1, title: 1, synopsis: 1 })) {
            batch.push(book);
            if (batch.length === BATCH_SIZE) {
                await processBatch();
            }
        }
        await processBatch();

        const staged = await books.countDocuments({
            [STAGING_MODEL_FIELD]: VOYAGE_MODEL,
            $expr: isValidVectorExpression(STAGING_VECTOR_FIELD)
        });
        if (staged !== total) {
            throw new Error(`Expected ${total} staged embeddings, found ${staged}; existing embeddings were not replaced.`);
        }

        await books.updateMany({ [STAGING_MODEL_FIELD]: VOYAGE_MODEL }, [
            {
                $set: {
                    embeddings: `$${STAGING_VECTOR_FIELD}`,
                    embeddingModel: VOYAGE_MODEL
                }
            },
            {
                $unset: [STAGING_VECTOR_FIELD, STAGING_MODEL_FIELD]
            }
        ]);

        const migrated = await books.countDocuments({
            embeddingModel: VOYAGE_MODEL,
            $expr: isValidVectorExpression('embeddings')
        });
        if (migrated !== total) {
            throw new Error(`Expected ${total} migrated embeddings, found ${migrated}.`);
        }

        console.log(`Updated ${migrated} books to ${VOYAGE_MODEL} (${VOYAGE_EMBEDDING_DIMENSIONS} dimensions).`);
    }
} finally {
    await client.close();
}
