import jwt from 'jsonwebtoken';
import { logger } from "../utilidades/logger.js";
import { GenerarJWT, GenerarRefreshToken } from "../utilidades/generadorjwt.js";
import { UsuariosActivos } from "../utilidades/Constantes.js";

export class AutenticacionControlador {
    Autenticar = async (req, res) => {
        try {
            const { refresh_token } = req.body;

            if (!refresh_token) {
                return res.status(401).json({
                    error: true,
                    estado: 401,
                    mensaje: 'Refresh token requerido'
                });
            }

            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        error: true,
                        estado: 403,
                        mensaje: 'Refresh token inválido o expirado'
                    });
                }

                const correo = decoded.correo;

                if (!UsuariosActivos[correo]) {
                    return res.status(403).json({
                        error: true,
                        estado: 403,
                        mensaje: 'Sesión no encontrada'
                    });
                }

                if (UsuariosActivos[correo].refreshToken !== refresh_token) {
                    return res.status(403).json({
                        error: true,
                        estado: 403,
                        mensaje: 'Refresh token inválido'
                    });
                }

                const tipoDeUsuario = UsuariosActivos[correo].tipoDeUsuario;
                const nombreDeUsuario = UsuariosActivos[correo].nombreDeUsuario; 

                const DatosUsuario = {
                    correo,
                    tipoDeUsuario,
                    nombreDeUsuario 
                };

                const nuevoAccessToken = await GenerarJWT(DatosUsuario);
                const nuevoRefreshToken = await GenerarRefreshToken({ correo });

                UsuariosActivos[correo].accessToken = nuevoAccessToken;
                UsuariosActivos[correo].refreshToken = nuevoRefreshToken;

                res.status(200).json({
                    error: false,
                    estado: 200,
                    access_token: nuevoAccessToken,
                    refresh_token: nuevoRefreshToken,
                    token_type: 'Bearer',
                    expires_in: 30
                });
            });

        } catch (error) {
            logger({ mensaje: error });
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: 'Error al refrescar el token'
            });
        }
    }
}