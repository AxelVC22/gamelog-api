import { Router } from "express";
import { SeguidorControlador } from "../controllers/SeguidorControlador.js";
import { ValidarJwt } from "../middlewares/jwt.js";

export const CrearRutaSeguidor = ({ModeloSeguidor}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Seguidor
     *  description: Gestión de Seguidores y Seguidos dentro de la API
     */
    const SeguidorEnrutador = Router();
    const ControladorSeguidorEnrutador = new SeguidorControlador({ModeloSeguidor});

    /**
     * @swagger
     * /seguidor:
     *   post:
     *     summary: Registrar un jugador a seguir
     *     tags: [Seguidor]
     *     description: Permite a un jugador seguir a otro. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idJugadorSeguidor:
     *                 type: integer
     *                 example: 1
     *               idJugadorSeguido:
     *                 type: integer
     *                 example: 2
     *     responses:
     *       200:
     *         description: El jugador ha comenzado a seguir exitosamente.
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
     *                   example: El seguimiento se ha registrado correctamente.
     *       400:
     *         description: Datos inválidos enviados en el cuerpo de la solicitud.
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
     *                   type: array
     *                   items:
     *                     type: string
     *                   example: 
     *                    - "los campos son inválidos"
     *                    - "Ya se ha registrado el seguimiento al jugador seleccionado"
     *       500:
     *         description: Error interno del servidor al intentar registrar el seguimiento.
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
     *                   example: Ha ocurrido un error en la base de datos al querer registrar el jugador a seguir.
     */
    SeguidorEnrutador.post('/',ValidarJwt,ControladorSeguidorEnrutador.RegistrarJugadorASeguir);

    /**
     * @swagger
     * /seguidor/seguidores/{idJugadorSeguido}:
     *   get:
     *     summary: Consultar los seguidores de un jugador
     *     tags: [Seguidor]
     *     description: Retorna una lista de jugadores que siguen al jugador especificado por su ID. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugadorSeguido
     *         required: true
     *         description: ID del jugador del que se desea obtener la lista de seguidores
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de seguidores obtenida exitosamente
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
     *                 seguidores:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       nombre:
     *                         type: string
     *                         example: Carlos
     *                       primerApellido:
     *                         type: string
     *                         example: Ramírez
     *                       segundoApellido:
     *                         type: string
     *                         example: Torres
     *                       nombreDeUsuario:
     *                         type: string
     *                         example: carlitos123
     *                       descripcion:
     *                         type: string
     *                         example: Soy un jugador activo
     *                       foto:
     *                         type: string
     *                         example: foto3.jpg
     *                       idJugador:
     *                         type: integer
     *                         example: 10
     *       400:
     *         description: Datos inválidos enviados en la solicitud
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
     *                   example: "idJugadorSeguido: campo requerido"
     *       404:
     *         description: No hay seguidores registrados para el jugador
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
     *                   example: No hay jugadores que lo siguen
     *       500:
     *         description: Error interno al realizar la consulta
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
     *                   example: Ha ocurrido un error al querer consultar los seguidores
     */
    SeguidorEnrutador.get('/seguidores/:idJugadorSeguido',ValidarJwt,ControladorSeguidorEnrutador.ConsultarSeguidores);

    /**
     * @swagger
     * /seguidor/seguidos/{idJugadorSeguidor}:
     *   get:
     *     summary: Consultar los jugadores seguidos por un jugador
     *     tags: [Seguidor]
     *     description: Retorna una lista de jugadores que están siendo seguidos por el jugador especificado. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugadorSeguidor
     *         required: true
     *         description: ID del jugador que sigue a otros jugadores
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de jugadores seguidos obtenida exitosamente
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
     *                 seguidos:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       nombre:
     *                         type: string
     *                         example: Laura
     *                       primerApellido:
     *                         type: string
     *                         example: Gómez
     *                       segundoApellido:
     *                         type: string
     *                         example: Martínez
     *                       nombreDeUsuario:
     *                         type: string
     *                         example: laurigame
     *                       descripcion:
     *                         type: string
     *                         example: Jugadora profesional
     *                       foto:
     *                         type: string
     *                         example: avatar7.png
     *                       idJugador:
     *                         type: integer
     *                         example: 17
     *       400:
     *         description: Datos inválidos enviados en la solicitud
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
     *                   example: "idJugadorSeguidor: campo requerido"
     *       404:
     *         description: El jugador no sigue a nadie
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
     *                   example: No hay jugadores seguidos por este usuario
     *       500:
     *         description: Error interno al realizar la consulta
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
     *                   example: Ha ocurrido un error al querer consultar los jugadores seguidos
     */
    SeguidorEnrutador.get('/seguidos/:idJugadorSeguidor',ValidarJwt,ControladorSeguidorEnrutador.ConsultarSeguidos);

    /**
     * @swagger
     * /seguidor/{idJugadorSeguidor}/{idJugadorSeguido}:
     *   delete:
     *     summary: Eliminar jugador seguido
     *     tags: [Seguidor]
     *     description: Permite eliminar a un jugador de la lista de jugadores seguidos por otro jugador. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugadorSeguidor
     *         required: true
     *         description: ID del jugador que sigue a otro jugador
     *         schema:
     *           type: integer
     *       - in: path
     *         name: idJugadorSeguido
     *         required: true
     *         description: ID del jugador que está siendo seguido
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Jugador eliminado exitosamente de la lista de seguidos
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
     *                   example: El jugador ha sido eliminado de la lista de seguidos
     *       400:
     *         description: Datos inválidos proporcionados
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
     *                    - "idJugadorSeguidor: campo requerido"
     *                    - "No se ha encontrado un seguimiento entre ambos jugadores"
     *       500:
     *         description: Error interno al eliminar el jugador seguido
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
     *                   example: Ha ocurrido un error en la base de datos al querer eliminar el jugador seguido
     */
    SeguidorEnrutador.delete('/:idJugadorSeguidor/:idJugadorSeguido',ValidarJwt,ControladorSeguidorEnrutador.EliminarSeguido);
    return SeguidorEnrutador;
}