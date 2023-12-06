// This should always be the first import!
import './load-env-vars.js';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectToDatabase } from './database.js';
import { exit } from 'process';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let client = await connectToDatabase(process.env.DATABASE_URI);
if (client) {
    console.log('Connected to database!');
} else {
    exit();
}

app.get('/', (_, res) => res.sendStatus(200));

app.use('/authors', (await import('./routes/authors.js')).default);
app.use('/books', (await import('./routes/books.js')).default);
app.use('/users', (await import('./routes/users.js')).default);
app.use('/books/:bookId/reviews', (await import('./routes/reviews.js')).default);
app.use('/reservations', (await import('./routes/reservations.js')).default);
app.use('/borrow', (await import('./routes/borrows.js')).default);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({message: 'Invalid Token'});
    } else {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
