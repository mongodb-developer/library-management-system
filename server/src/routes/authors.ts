import { Router } from 'express';
import { AuthorController } from '../controllers/authors.js';

const authors = Router();
export default authors;

const authorController = new AuthorController();

authors.get('/:authorId', async (req, res) => {
    const authorId = req?.params?.authorId;

    if (!authorId) {
        return res.status(400).send({ message: authorController.errors.AUTHOR_ID_MISSING });
    }

    const author = await authorController.getAuthor(authorId);

    if (!author) {
        return res.status(404).send({ message: authorController.errors.NOT_FOUND });
    }

    return res.json(author);
});
