import { Router } from 'express';

// The router will be added as a middleware and will take control of requests starting with /borrows.
const borrows = Router({mergeParams: true});
export default borrows;

/**
 * Routes
 *
 * POST /borrows/:bookId: Creates a new borrowed book for the logged in user
 * GET /borrows: Returns all borrowed books for the logged in user
 * POST /borrows/:bookId/return: Returns a borrowed book for the logged in user
 * GET /borrows/history: Returns the history of borrowed books for the logged in user
 *
 */
