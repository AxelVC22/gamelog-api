import { Router } from "express";
import { NotificacionControlador } from "../controllers/NotificacionControlador.js";
import { ValidarJwt } from "../middlewares/jwt.js";

export const CrearRutaNotificacion = ({ModeloNotificacion}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Notificaciones
     *  description: Rutas para la obtención y eliminación de notificaciones.
     */

    const NotificacionEnrutador = Router();
    const ControladorNotificacionEnrutador = new NotificacionControlador({ModeloNotificacion});

    /**
     * @swagger
     * /notificacion/jugador/{idJugador}:
     *   get:
     *     tags:
     *       - Notificaciones
     *     summary: Obtener notificaciones de un jugador
     *     description: Devuelve una lista de notificaciones recibidas por el jugador especificado. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         description: ID del jugador que recibirá las notificaciones.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de notificaciones obtenida exitosamente.
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
     *                 notificaciones:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       idNotificacion:
     *                         type: integer
     *                         example: 1
     *                       idJugadorNotificado:
     *                         type: integer
     *                         example: 5
     *                       idJugadorNotificante:
     *                         type: integer
     *                         example: 9
     *                       mensajeNotificacion:
     *                         type: string
     *                         example: Te han enviado una solicitud de amistad.
     *                       fechaNotificacion:
     *                         type: string
     *                         format: date-time
     *                         example: 2024-05-16T14:32:00Z
     *       400:
     *         description: Datos inválidos (por ejemplo, el ID no es numérico).
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
     *                   example: Datos inválidos, por favor verifique que sean correctos.
     *       404:
     *         description: No se encontraron notificaciones para el jugador.
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
     *                   example: No se han encontrado notificaciones por mostrar
     *       500:
     *         description: Error del servidor al consultar las notificaciones.
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
     *                   example: Ha ocurrido un error al querer obtener las notificacion del usuario
     */
    NotificacionEnrutador.get('/jugador/:idJugador',ValidarJwt,ControladorNotificacionEnrutador.ObtenerNotificaciones);
    
    /**
     * @swagger
     * /notificacion/{idNotificacion}:
     *   delete:
     *     tags:
     *       - Notificaciones
     *     summary: Eliminar una notificación
     *     description: Elimina una notificación específica por su ID. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idNotificacion
     *         required: true
     *         description: ID de la notificación que se desea eliminar.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: La notificación fue eliminada exitosamente.
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
     *                   example: La notificacion ha sido eliminada con éxito.
     *       400:
     *         description: El ID no es válido o no se encontró la notificación.
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
     *                   example: No se ha encontrado la notificacion a eliminar.
     *       500:
     *         description: Error del servidor al intentar eliminar la notificación.
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
     *                   example: Ha ocurrido un error al querer eliminar la notificacion
     */
    NotificacionEnrutador.delete('/:idNotificacion',ValidarJwt,ControladorNotificacionEnrutador.EliminarNotificacion);

    return NotificacionEnrutador;
}