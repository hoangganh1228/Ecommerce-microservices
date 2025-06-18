import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET) {
    throw new Error('JWT is not defined!')
}

const secret: Secret = JWT_SECRET;

export const signToken = (payload: object, expiresIn: SignOptions['expiresIn'] = '1h' ): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = <T>(token: string): T | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as T;
    } catch {
        return null;
    }
}