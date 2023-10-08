import { MongoClient, ObjectId } from 'mongodb';
import { Book } from '../models/book';
import { connectToDatabase, collections } from '../database.js';

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM';
const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';

export const getBaseUrl = () => `http://localhost:${process.env.PORT}`;

let databaseClient: MongoClient;

export const mochaHooks = {
    beforeAll: [
        async function () {
            await import('../load-env-vars.js');
            databaseClient = await connectToDatabase(process.env.DATABASE_URI);

            await cleanTestData();
            await initializeTestData();
        }
    ],
    afterAll: [
        async function () {
            await cleanTestData();
            await databaseClient.close();
        }
    ]
};

export async function initializeTestData() {
    await collections?.users?.insertMany([
        users.admin,
        users.user1,
    ]);
}

export async function cleanTestData() {
    await collections?.users?.deleteMany({
        _id: {
            $in: [
                users.admin._id,
                users.user1._id
            ]
        }
    });
}

export async function cleanDatabase() {
    return await Promise.all([
        collections?.books?.deleteOne({ _id: books.sample._id }),
        collections?.books?.deleteOne({ _id: books.oneCopy._id }),
        collections?.books?.deleteOne({ _id: books.notAvailable._id }),
        collections.issueDetails?.deleteMany({ _id: new RegExp(`^${users.user1._id}`) }),
        collections.reviews?.deleteMany({ name: users.user1.name })
    ]);
}

export const users = {
    admin: {
        _id: new ObjectId('64d4c964f0d056ea6bf0f3d8'),
        name: 'OldSchool Alligator',
        isAdmin: true,
        jwt: adminJWT,
    },
    user1: {
        _id: new ObjectId('64d4c7505bd483105c48991d'),
        name: 'Rowdy Hyena',
        jwt: userJWT,
    }
};

const book: Book = {
    _id: '9780075536321',
    title: 'Anna Karenina',
    authors: [{
        _id: new ObjectId(),
        name: 'Leo Tolstoy',
    }],
    cover: 'https://m.media-amazon.com/images/I/712ZWjY8VWL._AC_UF1000,1000_QL80_.jpg',
    genres: ['Fiction'],
    year: 1877,
    pages: 864,
    synopsis: 'Anna Karenina tells of the doomed love affair between the sensuous and rebellious Anna and the dashing officer, Count Vronsky. Tragedy unfolds as Anna rejects her passionless marriage and must endure the hypocrisies of society. Set against a vast and richly textured canvas of nineteenth-century Russia, the novel\'s seven major characters create a dynamic imbalance, playing out the contrasts of city and country life and all the variations on love and family happiness.',
    totalInventory: 10,
    available: 10,
    attributes: [{
        key: 'language',
        value: 'English',
    }],
    reviews: [{
        text: 'A masterpiece of world literature.',
        name: 'Amazon Customer',
        rating: 5,
        timestamp: 1600000000000,
    }],
};

const bookOneCopy: Book = {
    _id: '9781234567890',
    title: 'The Quantum Paradox',
    authors: [{
        _id: new ObjectId(),
        name: 'Elena Rodriguez',
    }],
    cover: 'https://m.media-amazon.com/images/I/81N9tZQ7h3L._AC_UF1000,1000_QL80_.jpg',
    genres: ['Science Fiction'],
    year: 2023,
    pages: 432,
    synopsis: 'The Quantum Paradox takes readers on a mind-bending journey through parallel universes and the nature of reality. When brilliant physicist Dr. Maria Santiago discovers a way to bridge the gap between dimensions, she sets off a chain of events that could reshape the fabric of existence itself. As governments and shadowy organizations vie for control of this technology, Maria must navigate a treacherous path to protect the boundaries of our world and the secrets of the multiverse.',
    totalInventory: 1,
    available: 1,
    attributes: [{
        key: 'language',
        value: 'English',
    }, {
        key: 'format',
        value: 'Hardcover',
    }],
    reviews: [{
        text: 'Mind-blowing exploration of quantum concepts.',
        name: 'SciFiEnthusiast',
        rating: 4,
        timestamp: 1678453200000,
    }, {
        text: 'A must-read for anyone fascinated by the mysteries of the universe.',
        name: 'SpaceTraveler',
        rating: 5,
        timestamp: 1678528800000,
    }],
};

const notAvailable: Book = {
    _id: '1239876543210',
    title: 'The Enigma Chronicles',
    authors: [{
        _id: new ObjectId(),
        name: 'Sophia Harper',
    }],
    cover: 'https://m.media-amazon.com/images/I/81PM6jgJz3L._AC_UF1000,1000_QL80_.jpg',
    genres: ['Mystery', 'Thriller'],
    year: 2022,
    pages: 520,
    synopsis: 'In "The Enigma Chronicles," renowned detective Alex Sinclair faces his most baffling case yet. A series of seemingly unrelated puzzles and crimes unfold across the city, leading Alex down a twisted path of secrets and deception. As he races against time to decipher the enigma behind these incidents, he uncovers a hidden conspiracy that threatens to shake the foundations of society. The line between friend and foe blurs as Alex navigates a web of intrigue and danger, determined to uncover the truth before it\'s too late.',
    totalInventory: 2,
    available: 0,
    attributes: [{
        key: 'language',
        value: 'English',
    }, {
        key: 'format',
        value: 'Paperback',
    }],
    reviews: [{
        text: 'A gripping mystery that keeps you guessing until the very end.',
        name: 'ThrillerFanatic',
        rating: 5,
        timestamp: 1685624400000,
    }, {
        text: 'Sophia Harper is a master of suspense.',
        name: 'MysteryEnthusiast',
        rating: 4,
        timestamp: 1685818800000,
    }],
};

export const books = {
    sample: book,
    oneCopy: bookOneCopy,
    notAvailable,
};
