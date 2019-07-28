import { Config } from '@app/config';
import { HttpError } from '@app/shared';
import { UserModel } from '@app/user';
import { compare, hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

export interface TokenData {
  id: string;
  iat: number;
  exp: number;
}

export class CryptoService {
  public compare = async (s: string, hashedString: string) => {
    return await compare(s, hashedString);
  }

  public hash = async (s: string) => {
    return await hash(s, 10);
  }

  public sign = async (payload: {}) => {
    return await sign(payload, process.env.SECRET_KEY as string, { expiresIn: Config.env.tokenExpiry });
  }

  public verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['x-access-token'] as string;
      if (!token) {
        throw new HttpError(403, 'No token provided.');
      }
      const tokenData = await verify(token, process.env.SECRET_KEY as string) as TokenData;
      const user = await UserModel.findById(tokenData.id);
      if (!user) {
        throw new HttpError(401, 'Unable to verify token.');
      }
      res.locals.tokenData = tokenData;
      next();
    } catch (err) {
      next(err);
    }
  }

}
