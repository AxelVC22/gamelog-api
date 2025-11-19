import { Router } from "express";
import { JuegoControlador } from "../controllers/JuegoControlador.js";
import { ValidarJwt } from "../middlewares/jwt.js";

export const CrearRutaJuego = ({ModeloJuego}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Juegos
     *  description: Gestión de los Juegos Inserción, consulta y eliminación
     */
    const JuegoEnrutador = Router();
    const ControladorJuegoEnrutador = new JuegoControlador({ModeloJuego});

    /**
     * @swagger
     * /juego:
     *   post:
     *     summary: Registrar un nuevo juego
     *     tags: [Juegos]
     *     description: Registra un nuevo juego en el sistema. Solo accesible para usuarios autenticados.
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
     *               - nombre
     *             properties:
     *               idJuego:
     *                 type: integer
     *                 example: 1
     *               nombre:
     *                 type: string
     *                 example: Ajedrez
     *               fechaDeLanzamiento:
     *                 type: date
     *                 example: 2025-05-09
     *     responses:
     *       200:
     *         description: Juego registrado correctamente
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
     *                   example: Juego registrado exitosamente.
     *       400:
     *         description: Datos inválidos o mal formateados
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
     *                   description: 
     *                    - "Detalles de los errores de validación"
     *                    - "Juego a ingresar se encuentra duplicado"
     *       500:
     *         description: Error interno del servidor o de base de datos
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
     *                   example: Ha ocurrido un error al querer registrar el juego.
     */
    JuegoEnrutador.post('/',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuego);

    /**
     * @swagger
     * /juego/favorito:
     *   post:
     *     summary: Registrar un juego como favorito para un jugador
     *     tags: [Juegos]
     *     description: Asocia un juego como favorito a un jugador. Solo usuarios autenticados pueden registrar juegos favoritos.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - idJugador
     *               - idJuego
     *             properties:
     *               idJugador:
     *                 type: integer
     *                 example: 5
     *               idJuego:
     *                 type: integer
     *                 example: 2
     *     responses:
     *       200:
     *         description: Juego favorito registrado correctamente
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
     *                   example: El juego fue registrado como favorito exitosamente.
     *       400:
     *         description: Datos inválidos o mal formateados
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
     *                   description: 
     *                    - "Detalles de los errores de validación"
     *                    - "Juego ya registrado previamente"
     *       500:
     *         description: Error interno del servidor o de base de datos
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
     *                   example: Ha ocurrido un error al querer registrar el juego como favorito.
     */
    JuegoEnrutador.post('/favorito',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuegoFavorito);

    /**
     * @swagger
     * /juego/pendiente:
     *   post:
     *     summary: Registrar un juego como pendiente para un jugador
     *     tags: [Juegos]
     *     description: Asocia un juego como pendiente a un jugador. Solo usuarios autenticados pueden registrar juegos pendientes.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - idJugador
     *               - idJuego
     *             properties:
     *               idJugador:
     *                 type: integer
     *                 example: 5
     *               idJuego:
     *                 type: integer
     *                 example: 3
     *     responses:
     *       200:
     *         description: Juego pendiente registrado correctamente
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
     *                   example: El juego fue registrado como pendiente exitosamente.
     *       400:
     *         description: Datos inválidos o mal formateados
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
     *                   description: 
     *                    - "Detalles de los errores de validación"
     *                    - "El juego ya ha sido agregado como favorito"
     *       500:
     *         description: Error interno del servidor o de base de datos
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
     *                   example: Ha ocurrido un error al querer registrar el juego como pendiente.
     */
    JuegoEnrutador.post('/pendiente',ValidarJwt,ControladorJuegoEnrutador.RegistrarJuegoPendiente);

    /**
     * @swagger
     * /juego/{idJuego}:
     *   get:
     *     summary: Buscar un juego por su ID
     *     tags: [Juegos]
     *     description: Retorna la información de un juego si el ID es válido y existe en la base de datos.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego que se desea buscar
     *     responses:
     *       200:
     *         description: Juego encontrado exitosamente
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
     *                 juego:
     *                   type: object
     *                   properties:
     *                     idJuego:
     *                       type: integer
     *                       example: 3
     *                     nombre:
     *                       type: string
     *                       example: "The Legend of Zelda"
     *       400:
     *         description: El ID proporcionado no es válido
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
     *                   type: object
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: No se encontró ningún juego con el ID especificado
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
     *                   example: No se ha encontrado el juego deseado.
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
     *                   example: Ha ocurrido un error al querer buscar el juego por ID
     */
    JuegoEnrutador.get('/:idJuego',ValidarJwt,ControladorJuegoEnrutador.BuscarJuegoPorID);

    /**
     * @swagger
     * /juego:
     *   get:
     *     summary: Buscar un juego por su nombre
     *     tags: [Juegos]
     *     description: Retorna la información del juego si el nombre coincide con un juego existente en la base de datos.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: nombre
     *         required: true
     *         schema:
     *           type: string
     *         description: Nombre del juego que se desea buscar
     *     responses:
     *       200:
     *         description: Juego encontrado exitosamente
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
     *                 juego:
     *                   type: object
     *                   properties:
     *                     idJuego:
     *                       type: integer
     *                       example: 7
     *                     nombre:
     *                       type: string
     *                       example: "Super Mario Bros"
     *       400:
     *         description: El nombre proporcionado no es válido
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
     *                   type: object
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: No se encontró ningún juego con el nombre especificado
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
     *                   example: No se ha encontrado el juego deseado.
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
     *                   example: Ha ocurrido un error al querer buscar el juego por nombre
     */
    JuegoEnrutador.get('/',ValidarJwt,ControladorJuegoEnrutador.BuscarJuegoPorNombre);

    /**
     * @swagger
     * /juego/favorito/{idJugador}:
     *   get:
     *     summary: Obtener lista de juegos favoritos de un jugador
     *     tags: [Juegos]
     *     description: Retorna los juegos marcados como favoritos por un jugador específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador del cual se desean obtener los juegos favoritos
     *     responses:
     *       200:
     *         description: Lista de juegos favoritos encontrada exitosamente
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
     *                 juegos:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       idJuego:
     *                         type: integer
     *                         example: 12
     *                       nombre:
     *                         type: string
     *                         example: "God of War"
     *       400:
     *         description: El ID del jugador no es válido
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
     *                   type: object
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: No se encontraron juegos favoritos para el jugador
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
     *                   example: No se encontraron juegos favoritos para el jugador.
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
     *                   example: Ha ocurrido un error al querer buscar los juegos favoritos
     */
    JuegoEnrutador.get('/favorito/:idJugador',ValidarJwt,ControladorJuegoEnrutador.ObtenerJuegosFavoritos);

    /**
     * @swagger
     * /juego/pendiente/{idJugador}:
     *   get:
     *     summary: Obtener lista de juegos pendientes por jugador
     *     tags: [Juegos]
     *     description: Retorna los juegos marcados como pendientes por un jugador específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador para el cual se desea obtener los juegos pendientes
     *     responses:
     *       200:
     *         description: Lista de juegos pendientes encontrada exitosamente
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
     *                 juegos:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       idJuego:
     *                         type: integer
     *                         example: 15
     *                       nombre:
     *                         type: string
     *                         example: "The Legend of Zelda"
     *       400:
     *         description: El ID del jugador no es válido
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
     *                   type: object
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: No se encontraron juegos pendientes para el jugador
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
     *                   example: No se encontraron juegos pendientes para el jugador.
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
     *                   example: Ha ocurrido un error al querer buscar los juegos pendientes
     */
    JuegoEnrutador.get('/pendiente/:idJugador',ValidarJwt,ControladorJuegoEnrutador.ObtenerJuegosPendientes);

    /**
     * @swagger
     * /juego/{idJuego}:
     *   delete:
     *     summary: Eliminar un juego por ID
     *     tags: [Juegos]
     *     description: Elimina un juego específico de la base de datos según su ID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego que se desea eliminar
     *     responses:
     *       200:
     *         description: Juego eliminado exitosamente
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
     *                   example: Juego eliminado correctamente.
     *       400:
     *         description: El ID del juego no es válido
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
     *                   description: 
     *                    - "Detalles de los errores de validación"
     *                    - "No se ha encontrado el juego a eliminar"
     *       500:
     *         description: Error interno del servidor o de la base de datos al intentar eliminar el juego
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
     *                   example: Ha ocurrido un error al querer eliminar el juego
     */
    JuegoEnrutador.delete('/:idJuego',ValidarJwt,ControladorJuegoEnrutador.EliminarJuego);

    /**
     * @swagger
     * /juego/favorito/{idJuego}/{idJugador}:
     *   delete:
     *     summary: Eliminar juego favorito de un jugador
     *     tags: [Juegos]
     *     description: Elimina la relación de un juego marcado como favorito por un jugador específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego a eliminar de la lista de favoritos
     *     responses:
     *       200:
     *         description: Juego favorito eliminado correctamente
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
     *                   example: Juego favorito eliminado correctamente.
     *       400:
     *         description: Datos inválidos en la solicitud (por ejemplo, IDs mal formateados)
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
     *                   description: 
     *                    - "Detalles de los errores de validación"
     *                    - "No se ha encontrado el juego favorito a eliminar"
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
     *                   example: Ha ocurrido un error al querer eliminar el juego favorito
     */
    JuegoEnrutador.delete('/favorito/:idJuego/:idJugador',ValidarJwt,ControladorJuegoEnrutador.EliminarJuegoFavorito);

    /**
     * @swagger
     * /juego/pendiente/{idJuego}/{idJugador}:
     *   delete:
     *     summary: Eliminar juego pendiente de un jugador
     *     tags: [Juegos]
     *     description: Elimina la relación de un juego marcado como pendiente por un jugador específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador
     *       - in: path
     *         name: idJuego
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del juego a eliminar de la lista de pendientes
     *     responses:
     *       200:
     *         description: Juego pendiente eliminado correctamente
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
     *                   example: Juego pendiente eliminado correctamente.
     *       400:
     *         description: Datos inválidos en la solicitud (por ejemplo, IDs mal formateados)
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
     *                   description: 
     *                    - "Detalles de los errores de validación"
     *                    - "No se ha encontrado el juego pendiente a eliminar"
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
     *                   example: Ha ocurrido un error al querer eliminar el juego pendiente
     */
    JuegoEnrutador.delete('/pendiente/:idJuego/:idJugador',ValidarJwt,ControladorJuegoEnrutador.EliminarJuegoPendiente);
    
    return JuegoEnrutador;
}