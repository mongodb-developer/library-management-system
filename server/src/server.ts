// This should always be the first import!
import './load-env-vars.js';

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { connectToDatabase } from './database.js';
import { RegisterRoutes } from './swagger/routes.js';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: { url: '/swagger.json' }
    })
);

await connectToDatabase(process.env.DATABASE_URI);
console.log('Connected to database!');

app.get('/', (_, res) => res.send(200));

RegisterRoutes(app);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
