import {createClient} from 'redis';
import { logger } from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

export const Publicador = createClient({
    url: process.env.REDIS_URL
});

(async () => {
    try {
        await Publicador.connect();
    } catch (err) {
        logger({ mensaje: `Error al conectar a Redis: ${err.message}` });
    }
})();

const PublicadorAsync = async (channel,data) =>{
    try
    {
        await Publicador.publish(channel,JSON.stringify(data));
    }
    catch(error)
    {
        logger({mensaje: error});
    }
};

const PublicarEvento = async (channel,data) => 
{
    return PublicadorAsync(channel,data);
}

export const PublicarAccionReseña = async (idJuego,accion,datos = {}) =>
{
    await PublicarEvento(`resenas_juego_${idJuego}`,{
        accion,
        ...datos,
        timeStamp: new Date().toISOString()
    });
}

export const PublicarAccionSocial = async (idJugador,accion,datos = {}) =>
{
    await PublicarEvento(`jugador_${idJugador}`,{
        accion,
        ...datos,
        timeStamp: new Date().toISOString()
    });
}

export const EjecutarNotificacion = (fn) => 
{
    try {
        setImmediate(() => {
            const promesa = fn();
            if (promesa && typeof promesa.catch === 'function') {
                promesa.catch(error =>
                    logger({ mensaje: `Error al notificar a redis: ${error.message}` })
                );
            }
        });
    } catch (error) {
        logger({ mensaje: `Error al ejecutar función de notificación: ${error.message}` });
    }
}

Publicador.on('connect', () => logger({mensaje: 'Conectado a Redis'}));
Publicador.on('error', (error) => logger({mensaje: `Error al intentar comunicarse con Redis: ${error}`}));