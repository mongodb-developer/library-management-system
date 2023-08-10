import { expressjwt as jwt } from 'express-jwt';

const secret = process.env.SECRET || 'secret';
const protectedRoute = jwt({
    secret,
    algorithms: ['HS256']
});

export { protectedRoute };