// This should always be the first import!
import './load-env-vars.js';

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database.js';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

await connectToDatabase(process.env.DATABASE_URI);
console.log('Connected to database!');

app.get('/', (_, res) => res.send(200));

app.use('/books', (await import('./routes/books.js')).default);
app.use('/users', (await import('./routes/users.js')).default);
app.use('/books/:bookId/reviews', (await import('./routes/reviews.js')).default);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
