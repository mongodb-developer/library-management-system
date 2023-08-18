import { expressjwt as jwt } from 'express-jwt';

const secret = process.env.SECRET;
const protectedRoute = jwt({
    secret,
    algorithms: ['HS256']
});

const adminRoute = (req, res, next) => {
    if (!req?.auth?.isAdmin) {
        return res.status(403).send({message: 'You are not authorized to access this resource.'});
    }
    next();
};

export {
    protectedRoute,
    adminRoute
};