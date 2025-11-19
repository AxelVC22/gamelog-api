import { createClient } from "redis";
import { logger } from "../utils/Logger.js";
import dotenv from 'dotenv';

dotenv.config();
const CanalesDeSuscripcion = ['resenas_juego_*','jugador_*'];

export async function CrearSuscriptorRedis(io)
{
    const Suscriptor = createClient({
        url: process.env.REDIS_URL
    });
    Suscriptor.on('error',(error) =>{
        logger({mensaje: `Error en el suscriptor redis: ${error.message}`});
        io.to('broadcast_mensajes_servidor').emit('broadcast_mensajes_servidor',{mensaje: 'No se pueden obtener actualizaciones y notificaciones, es posible que algunas partes del sistema no sean actualizadas en tiempo real.'});
    })
    Suscriptor.on('connect',()=>{
        console.log('Conectado a redis como suscriptor');
        io.to('broadcast_mensajes_servidor').emit('broadcast_mensajes_servidor',{mensaje: 'Las notificaciones y actualizaciones aparecerán en tiempo real'});
    })
    await inicializarSuscriptor(Suscriptor,io);
    return Suscriptor;
}

async function inicializarSuscriptor(suscriptor,io) {
    try
    {
        await suscriptor.connect();
        await Promise.all(
            CanalesDeSuscripcion.map(patron =>
                suscriptor.pSubscribe(patron,(message,channel) =>{
                    ManejarMensajeRedis(io,channel,message);
                })
            )
        );
    }
    catch(error)
    {
        logger({mensaje:`Error al intentar suscribirse a redis: ${error}` });
    }
}

function ManejarMensajeRedis(io,channel,message)
{
    try
    {
        const data = JSON.parse(message);
        const CanalResenasCoincide = channel.match(/^resenas_juego_(\d+)$/);
        const CanalJugadorCoincide = channel.match(/^jugador_(\d+)$/);
        if(CanalResenasCoincide)
        {
            const IdJuego = CanalResenasCoincide[1];
            io.to(`resenas_juego_${IdJuego}`).emit('actualizacion_resenas',data);
        }
        else if(CanalJugadorCoincide)
        {
            const IdJugador = CanalJugadorCoincide[1];
            io.to(`jugador_${IdJugador}`).emit('notificacion_jugador',data);
        }
    }
    catch(error)
    {
        logger({mensaje:`Error al intentar manejar el mensaje recibido: ${error}`});
    }
}