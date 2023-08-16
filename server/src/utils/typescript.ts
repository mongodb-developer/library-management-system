import { Request } from 'express';
interface AuthRequest extends Request {
  auth: {
    sub: string,
    name: string,
    isAdmin: boolean,
    iat: number,
    exp: number
  };
}

export {
    AuthRequest
};