import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (payload: Object, options: SignOptions = {}) => {
    const privateKey = process.env.accessTokenPrivateKey as string;
    const result = null;
    try {
        const result = jwt.sign(payload, privateKey, {
            ...(options && options),
            algorithm: 'RS256',
            expiresIn: '8h'
        });
        return result;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const verifyJwt = <T>(token: string): T | null => {
    try {
        const publicKey = process.env.accessTokenPublicKey as string;
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        return null;
    }
};