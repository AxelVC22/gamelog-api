import { Router } from "express";
import { ReseñaControlador } from "../controllers/ReseñaControlador.js";
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaReseña =  ({ModeloReseña}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Reseñas
     *  description: Rutas de la gestión de reseñas
     */

    const ReseñaEnrutador = Router();
    const ControladorReseñaEnrutador = new ReseñaControlador({ModeloReseña});

    /**
     * @swagger
     * /resena:
     *   post:
     *     summary: Registrar una nueva reseña
     *     tags: [Reseñas]
     *     description: Permite a un usuario autenticado registrar una nueva reseña para un juego.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - idJuego
     *               - idJugador
     *               - calificacion
     *               - comentario
     *             properties:
     *               idJuego:
     *                 type: integer
     *                 example: 42
     *               idJugador:
     *                 type: integer
     *                 example: 7
     *               calificacion:
     *                 type: number
     *                 format: float
     *                 minimum: 0
     *                 maximum: 5
     *                 example: 4.5
     *               comentario:
     *                 type: string
     *                 example: "Muy buen juego, me encantó la jugabilidad y los gráficos."
     *     responses:
     *       200:
     *         description: Reseña registrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 mensaje:
     *                   type: string
     *                   example: Reseña registrada correctamente
     *       400:
     *         description: Error en los datos de entrada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: string
     *                   example: 
     *                    - "idJuego es requerido"
     *                    - "El id de juego ingresado o juego no se encuentra registrado" 
     *       500:
     *         description: Error interno del servidor o de la base de datos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer registrar la reseña
     */
    ReseñaEnrutador.post('/',ValidarJwt,ControladorReseñaEnrutador.RegistrarReseña);

    /**
     * @swagger
     * /resena/jugador/{idJugador}:
     *   get:
     *     summary: Obtener reseñas hechas por un jugador
     *     tags: [Reseñas]
     *     description: Recupera todas las reseñas realizadas por un jugador específico. Incluye detalles del juego, fecha, opinión, calificación y cantidad de likes por reseña.
     *     security:
     *       - bearerAuth: [] 
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador del cual se quieren obtener las reseñas
     *         example: 12
     *       - in: query
     *         name: idJugadorBuscador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador que realiza la búsqueda (Para validar si le ha dado like a alguna reseña obtenida)
     *         example: 34  
     *     responses:
     *       200:
     *         description: Reseñas encontradas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 reseñas:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       idResenia:
     *                         type: integer
     *                         example: 5
     *                       idJugador:
     *                         type: integer
     *                         example: 12
     *                       idJuego:
     *                         type: integer
     *                         example: 42
     *                       nombre:
     *                         type: string
     *                         example: "The Legend of Zelda: Breath of the Wild"
     *                       fecha:
     *                         type: string
     *                         format: date-time
     *                         example: "2024-12-01T14:30:00Z"
     *                       opinion:
     *                         type: string
     *                         example: "Una experiencia increíble, el mundo abierto es impresionante."
     *                       calificacion:
     *                         type: integer
     *                         minimum: 1
     *                         maximum: 5
     *                         example: 5
     *                       totalDeLikes:
     *                         type: integer
     *                         example: 8
     *                       existeLike:
     *                         type: bit
     *                         example: 0
     *       400:
     *         description: Error de validación en los parámetros de entrada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: string
     *                   example: { "idJugador": "El idJugador es obligatorio" }
     *       404:
     *         description: No se encontraron reseñas para el jugador
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 404
     *                 mensaje:
     *                   type: string
     *                   example: No se han encontrado reseñas registradas
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer obtener las reseñas de un jugador
     */
    ReseñaEnrutador.get('/jugador/:idJugador',ValidarJwt,ControladorReseñaEnrutador.ObtenerReseñasDeJugador);

    /**
     * @swagger
     * /resena/juego/{idJuego}:
     *   get:
     *     summary: Obtener reseñas de un juego
     *     tags: [Reseñas]
     *     description: Recupera todas las reseñas hechas por jugadores sobre un juego específico. Incluye nombre de usuario, foto, opinión, calificación, y total de likes.
     *     security:
     *       - bearerAuth: [] 
     *     parameters:
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego del cual se desean obtener las reseñas
     *         example: 42
     *       - in: query
     *         name: idJugadorBuscador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador que realiza la búsqueda (Para validar si le ha dado like a alguna reseña obtenida)
     *         example: 34 
     *     responses:
     *       200:
     *         description: Reseñas encontradas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 reseñas:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       idResenia:
     *                         type: integer
     *                         example: 3
     *                       idJugador:
     *                         type: integer
     *                         example: 12
     *                       nombreDeUsuario:
     *                         type: string
     *                         example: "gamer_pro92"
     *                       foto:
     *                         type: string
     *                         example: "https://cdn.example.com/avatars/avatar12.png"
     *                       idJuego:
     *                         type: integer
     *                         example: 42
     *                       nombre:
     *                         type: string
     *                         example: "Elden Ring"
     *                       fecha:
     *                         type: string
     *                         format: date-time
     *                         example: "2025-01-15T13:45:00Z"
     *                       opinion:
     *                         type: string
     *                         example: "Un juego desafiante pero muy gratificante. De lo mejor en años."
     *                       calificacion:
     *                         type: integer
     *                         minimum: 1
     *                         maximum: 5
     *                         example: 5
     *                       totalDeLikes:
     *                         type: integer
     *                         example: 14
     *                       existeLike:
     *                         type: bit
     *                         example: 0
     *       400:
     *         description: Error de validación en los parámetros de entrada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: string
     *                   example: { "idJuego": "El idJuego es obligatorio" }
     *       404:
     *         description: No se encontraron reseñas para el juego
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 404
     *                 mensaje:
     *                   type: string
     *                   example: No se han encontrado reseñas registradas por algún jugador
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer obtener las reseñas del juego seleccionado
     */
    ReseñaEnrutador.get('/juego/:idJuego',ValidarJwt,ControladorReseñaEnrutador.ObtenerReseñasDeUnJuego);

    /**
     * @swagger
     * /resena/juego/{idJuego}/seguidos:
     *   get:
     *     summary: Obtener reseñas de un juego escritas por jugadores seguidos
     *     tags: [Reseñas]
     *     description: Retorna las reseñas de un juego específico realizadas únicamente por los jugadores que el usuario autenticado sigue.
     *     security:
     *       - bearerAuth: []  # Requiere autenticación
     *     parameters:
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego
     *         example: 42
     *       - in: query
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador autenticado (quien sigue a otros jugadores)
     *         example: 7
     *     responses:
     *       200:
     *         description: Reseñas encontradas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 reseñas:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       idResenia:
     *                         type: integer
     *                         example: 9
     *                       idJugador:
     *                         type: integer
     *                         example: 15
     *                       nombreDeUsuario:
     *                         type: string
     *                         example: "seguido_master"
     *                       foto:
     *                         type: string
     *                         example: "https://cdn.example.com/avatars/avatar15.jpg"
     *                       idJuego:
     *                         type: integer
     *                         example: 42
     *                       nombre:
     *                         type: string
     *                         example: "Elden Ring"
     *                       fecha:
     *                         type: string
     *                         format: date-time
     *                         example: "2025-04-10T10:22:00Z"
     *                       opinion:
     *                         type: string
     *                         example: "Gran narrativa y mundo abierto espectacular."
     *                       calificacion:
     *                         type: integer
     *                         minimum: 1
     *                         maximum: 5
     *                         example: 4
     *                       totalDeLikes:
     *                         type: integer
     *                         example: 8
     *                       existeLike:
     *                         type: bit
     *                         example: 0
     *       400:
     *         description: Error de validación en los parámetros de entrada
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: string
     *                   example: { "idJuego": "El idJuego es obligatorio", "idJugador": "El idJugador es obligatorio" }
     *       404:
     *         description: No se encontraron reseñas hechas por jugadores seguidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 404
     *                 mensaje:
     *                   type: string
     *                   example: No se han encontrado reseñas registradas por jugadores seguidos
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer obtener las reseñas de los jugadores seguidos
     */
    ReseñaEnrutador.get('/juego/:idJuego/seguidos',ValidarJwt,ControladorReseñaEnrutador.ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos);

    /**
     * @swagger
     * /resena/{idResena}:
     *   delete:
     *     summary: Eliminar una reseña existente
     *     tags: [Reseñas]
     *     description: Permite a un usuario autenticado eliminar una reseña por su ID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego asociado a la reseña a eliminar
     *         example: 14137
     *       - in: path
     *         name: idResena
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la reseña a eliminar
     *         example: 101
     *     responses:
     *       200:
     *         description: Reseña eliminada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 mensaje:
     *                   type: string
     *                   example: Reseña eliminada correctamente
     *       400:
     *         description: Error de validación en el ID de reseña
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: string
     *                   example: 
     *                    - "idReseña es requerido"
     *                    - "El id de reseña ingresado no se encuentra registrado"
     *       500:
     *         description: Error interno del servidor o de la base de datos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer eliminar la reseña
     */
    ReseñaEnrutador.delete('/:idJuego/:idResena',ValidarJwt,ControladorReseñaEnrutador.EliminarReseña);
    
    return ReseñaEnrutador;
}