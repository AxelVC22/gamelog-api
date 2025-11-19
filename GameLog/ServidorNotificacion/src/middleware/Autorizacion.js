import { logger } from "../utils/Logger.js";

export function AutenticarUsuarioSockets(socket,next)
{
    try
    {
        const {usuario,contrasenia} = socket.handshake.query;
        if(usuario && contrasenia)
        {
            if(usuario === process.env.USUARIO && contrasenia === process.env.CONTRASENIA)
            {
                return next();
            }
            else
            {
                setImmediate(() => socket.disconnect(true));
                return next(new Error('Credenciales ingresadas incorrectas.'));
            }
        }
        else
        {
            setImmediate(() => socket.disconnect(true));
            return next(new Error('Se requiere un usuario y contraseña para acceder al servidor.'));
        }
    }
    catch(error)
    {
        setImmediate(() => socket.disconnect(true));
        logger({mensaje: `Error al querer autenticar el usuario: ${error}`});
        return next(new Error('Error al querer autenticar el usuario.'));
    }
}