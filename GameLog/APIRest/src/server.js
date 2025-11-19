import express, { json } from 'express';
import { CrearRutaAcceso } from './api_rest/routes/AccesoRuta.js';
import { CrearRutaLogin } from './api_rest/routes/LoginRuta.js';
import { CrearRutaJugador } from './api_rest/routes/JugadorRuta.js';
import { CrearRutaJuego } from './api_rest/routes/JuegoRuta.js';
import { CrearRutaSeguidor } from './api_rest/routes/SeguidorRuta.js';
import { CrearRutaReseña } from './api_rest/routes/ReseñaRuta.js';
import { CrearRutaMeGusta } from './api_rest/routes/MeGustaRuta.js';
import { CrearRutaReportesEstadisticos } from './api_rest/routes/ReportesRuta.js';
import { CrearRutaNotificacion } from './api_rest/routes/NotificacionRuta.js';
import { DocumentoSwagger } from './api_rest/utilidades/swagger.js';
import { CorsMiddleware } from './api_rest/middlewares/cors.js';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';


export const CrearServidor = ({ModeloAcceso, ModeloLogin,ModeloJugador,ModeloJuego,ModeloSeguidor,ModeloReseña,ModeloMeGusta,ModeloReportesEstadisticos,ModeloNotificacion}) => 
{
    const app = express();
    dotenv.config();
    app.use(json());
    app.use(CorsMiddleware());
    app.disable('x-powered-by');
    app.get('/gamelog',(req,res)=>{
        res.json({message: 'Bienvenido al servidor de GameLogAPI'});
    });
    app.use('/gamelog/login',CrearRutaLogin({ModeloLogin,ModeloAcceso}));
    app.use('/gamelog/acceso', CrearRutaAcceso({ModeloAcceso}));
    app.use('/gamelog/jugador',CrearRutaJugador({ModeloJugador}));
    app.use('/gamelog/juego',CrearRutaJuego({ModeloJuego}));
    app.use('/gamelog/seguidor',CrearRutaSeguidor({ModeloSeguidor}));
    app.use('/gamelog/resena',CrearRutaReseña({ModeloReseña}));
    app.use('/gamelog/MeGusta',CrearRutaMeGusta({ModeloMeGusta}));
    app.use('/gamelog/reporte',CrearRutaReportesEstadisticos({ModeloReportesEstadisticos}));
    app.use('/gamelog/notificacion',CrearRutaNotificacion({ModeloNotificacion}));
    app.use('/gamelog/doc',swaggerUI.serve, swaggerUI.setup(DocumentoSwagger));
    const PUERTO = process.env.PUERTO;
    app.use((err, req, res, next) => {
        if (err.message === 'CORS Invalido') {
            return res.status(401).json({ error: 'No se puede enviar solicitudes ni recibir respuestas del servidor.' });
        }
        next(err);
    });
    app.listen(PUERTO,()=>{
        console.log(`Servidor activo en la siguiente ruta http://localhost:${PUERTO}`);
    });
}