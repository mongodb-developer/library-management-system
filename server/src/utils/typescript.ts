import { Request } from 'express';
interface IAuthRequest extends Request {
  auth: {
    sub: string,
    name: string,
    isAdmin: boolean,
    iat: number,
    exp: number
  };
}

export {
    IAuthRequest
};