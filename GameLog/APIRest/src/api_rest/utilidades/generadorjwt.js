import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

export const GenerarJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '30s'
            }, 
            (err, token) => {
                if (err) {
                    logger(err);
                    reject({ Error: true });
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export const GenerarRefreshToken = (DatosUsuario) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            DatosUsuario,
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    logger(err);
                    reject({ Error: true });
                } else {
                    resolve(token);
                }
            }
        );
    });
};