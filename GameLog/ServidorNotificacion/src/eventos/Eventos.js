import { logger } from "../utils/Logger.js";

export function CrearEventosDeSocket(io)
{
    io.on('connection',(socket) =>{

        console.log(`Cliente conectado ${socket.id}`);

        socket.join('broadcast_mensajes_servidor');
        
        logger({ mensaje: `Cliente conectado: ${socket.id}` });

        socket.on('broadcast_mensajes_servidor',() =>{
            socket.join('broadcast_mensajes_servidor');
        });

        socket.on('suscribir_notificacion_jugador',(idJugador) =>{
            socket.join(`jugador_${idJugador}`);
            logger({ mensaje: `${socket.id} se suscribió a jugador_${idJugador}` });
        });

        socket.on('desuscribir_notificacion_jugador',(idJugador)=>{
            socket.leave(`jugador_${idJugador}`);
            logger({ mensaje: `${socket.id} se desuscribió de jugador_${idJugador}` });
        });

        socket.on('suscribir_interaccion_resenas',(idJuego) =>{
            socket.join(`resenas_juego_${idJuego}`);
            logger({ mensaje: `${socket.id} se suscribió a resenas_juego_${idJuego}` });
        });

        socket.on('desuscribir_interaccion_resenas',(idJuego) =>{
            socket.leave(`resenas_juego_${idJuego}`);
            logger({ mensaje: `${socket.id} se desuscribió de resenas_juego_${idJuego}` });
        });

        socket.on('disconnect',()=>{
            logger({mensaje: `${socket.id} se ha desconectado.`})
        });
    });
}