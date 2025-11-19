import { Server } from "socket.io";
import { createServer } from "http";
import { logger } from "./utils/Logger.js";
import { CrearEventosDeSocket } from "./eventos/Eventos.js";
import { CrearSuscriptorRedis } from "./redis/RedisSub.js";
import { AutenticarUsuarioSockets } from "./middleware/Autorizacion.js";

export async function CrearServidorWebSocket(app)
{
    const ServidorHTTP = createServer(app);
    const io = new Server(ServidorHTTP,{
        cors: {
            origin: true,
            methods: ['GET','POST','DELETE']
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 15 * 60 * 1000,
            skipMiddlewares: false
        },
        allowEIO3: true,
        transports: ["websocket"],
        maxHttpBufferSize: 1e8,
        cookie: false,
        pingTimeout: 90000,
        pingInterval: 30000, 
    });
    io.use((socket, next) => {
        console.log(`Nueva conexión entrante: ${socket.id}`);
        next();
    });
    io.use(AutenticarUsuarioSockets);
    CrearEventosDeSocket(io);
    CrearSuscriptorRedis(io);
    io.on('connection',(socket) =>{
        console.log(`Cliente conectado ${socket.id}`);
    });
    io.on('connection_error',(error) =>{
        logger({mensaje: `Error de conexion en Socket.io: ${error.message}`});
    });
    return ServidorHTTP;
}