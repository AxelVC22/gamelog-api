import jwt from 'jsonwebtoken';
import { logger } from '../utilidades/logger.js';

export const ValidarJwt = (request, response, next) => {
    try {
        const HeaderAutenticacion = request.header('authorization') || request.header('access_token');
        const Token = HeaderAutenticacion?.startsWith('Bearer ')
            ? HeaderAutenticacion.split(' ')[1]
            : HeaderAutenticacion;
        
        if (Token) {
            const {correo, tipoDeUsuario, nombreDeUsuario} = jwt.verify(
                Token, 
                process.env.ACCESS_TOKEN_SECRET
            );
            
            request.correo = correo;
            request.tipoDeUsuario = tipoDeUsuario;
            request.nombreDeUsuario = nombreDeUsuario;
            next();
        } else {
            response.status(401).json({
                error: true,
                estado: 401,
                mensaje: 'No hay un token de autenticación dentro de la solicitud'
            });
        }
    } catch(error) {
        logger(error);
        response.status(401).json({
            error: true,
            estado: 401,
            mensaje: 'La sesión no es válida o ha expirado. Por favor, vuelva a iniciar sesión.'
        });
    }
}