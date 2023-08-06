import request from 'supertest';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { Book } from '../models/book';

const baseUrl = 'http://localhost:5000';

describe('Books API', () => {
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
        }],
    };

    it('Should persist documents', () => {
        request(baseUrl)
            .post('/books')
            .send(book)
            .expect(201)
            .end((err, res) => {
                if (err) throw err;
                assert(res.text.includes('Created a new book with id'));
            });

        request(baseUrl)
            .get('/books')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) throw err;
                assert(res.body[0].title === book.title);
                assert(res.body[0].authors === book.authors);
            });
    });

    it('Should retrieve documents', () => {
        request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) throw err;
                assert(res.body.title === book.title);
                assert(res.body.authors === book.authors);
            });
    });

    // it('Should update documents', () => {
    //     request(baseUrl)
    //         .put(`/books/${book._id}`)
    //         .send({
    //             ...book,
    //             title: 'War and Peace',
    //         })
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) throw err;
    //             assert(res.text.includes('Updated book with id'));
    //         });

    //     request(baseUrl)
    //         .get(`/books/${book._id}`)
    //         .expect(200)
    //         .expect('Content-Type', /json/)
    //         .end((err, res) => {
    //             if (err) throw err;
    //             assert(res.body.title === 'War and Peace');
    //         });
    // });

    it('Should delete documents', () => {
        request(baseUrl)
            .delete(`/books/${book._id}`)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                assert(res.text.includes('Deleted book with id'));
            });

        request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(404)
            .end((err, res) => {
                if (err) throw err;
                assert(res.text.includes(`Book with id ${book._id} was not found`));
            });
    }
    );

    // it('Should return 404 for non-existent documents', () => {
    //     request(baseUrl)
    //         .get(`/books/${book._id}`)
    //         .expect(404)
    //         .end((err, res) => {
    //             if (err) throw err;
    //             assert(res.text.includes(`Book with id ${book._id} was not found`));
    //         });
    // }
    // );

    // it('Should return 400 for missing id', () => {
    //     request(baseUrl)
    //         .get('/books')
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) throw err;
    //             assert(res.text.includes('Book id is missing'));
    //         });
    // }
    // );

    // it('Should return 400 for missing body', () => {
    //     request(baseUrl)
    //         .post('/books')
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) throw err;
    //             assert(res.text.includes('Book details are missing'));
    //         });
    // }
    // );

    // it('Should return 400 for missing update data', () => {
    //     request(baseUrl)
    //         .put(`/books/${book._id}`)
    //         .expect(400)
    //         .end((err, res) => {
    //             if (err) throw err;
    //             assert(res.text.includes('Book details are missing'));
    //         });
    // }
    // );
});
