import { ObjectId } from 'mongodb';
import { Book } from '../models/book';

const baseUrl = 'http://localhost:5000';

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM';
const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';

const users = {
    admin: {
        jwt: adminJWT,
        _id: '64d4c964f0d056ea6bf0f3d8'
    },
    user1: {
        jwt: userJWT,
        _id: '64d4c7505bd483105c48991d'
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

const books = {
    sample: book,
    oneCopy: bookOneCopy,
};

export {
    baseUrl,
    users,
    books
};