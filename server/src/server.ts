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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
