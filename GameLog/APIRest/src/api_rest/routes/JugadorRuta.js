import { Router } from 'express';
import { JugadorControlador } from '../controllers/JugadorControlador.js';
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaJugador = ({ModeloJugador}) => 
{
    /**
     * @swagger
     * tags:
     *  name: Jugador
     *  description: Gestión de los perfiles de los jugadores.
     */
    const JugadorEnrutador = Router();
    const ControladorJugadorEnrutador = new JugadorControlador({ModeloJugador});

    /**
     * @swagger
     * /jugador/{nombreDeUsuario}:
     *   get:
     *     summary: Buscar jugador por nombre de usuario
     *     tags: [Jugador]
     *     description: Retorna la información de un jugador a partir de su nombre de usuario si existe en el sistema.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: nombreDeUsuario
     *         required: true
     *         schema:
     *           type: string
     *         description: Nombre de usuario del jugador a buscar
     *     responses:
     *       200:
     *         description: Jugador encontrado exitosamente
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
     *                 cuenta:
     *                   type: array
     *                   description: Información de la cuenta y del jugador
     *                   items:
     *                     type: object
     *                     properties:
     *                       idCuenta:
     *                         type: integer
     *                         example: 12
     *                       correo:
     *                         type: string
     *                         example: jugador@email.com
     *                       estado:
     *                         type: string
     *                         example: activo
     *                       idJugador:
     *                         type: integer
     *                         example: 5
     *                       nombre:
     *                         type: string
     *                         example: Juan
     *                       primerApellido:
     *                         type: string
     *                         example: Pérez
     *                       segundoApellido:
     *                         type: string
     *                         example: Gómez
     *                       nombreDeUsuario:
     *                         type: string
     *                         example: juanperez123
     *                       descripcion:
     *                         type: string
     *                         example: Defensa central con gran experiencia.
     *                       foto:
     *                         type: string
     *                         example: foto.jpg
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
     *                   type: object
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: Jugador no encontrado
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
     *                   example: No se ha encontrado el jugador deseado a buscar.
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
     *                   example: Ha ocurrido un error al querer buscar el jugador.
     */
    JugadorEnrutador.get('/:nombreDeUsuario',ValidarJwt,ControladorJugadorEnrutador.BuscarJugador);
    
    /**
     * @swagger
     * /jugador/{idJugador}:
     *   put:
     *     summary: Actualizar datos de perfil de un jugador
     *     tags: [Jugador]
     *     description: Permite actualizar la información del perfil de un jugador existente. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nombre:
     *                 type: string
     *                 example: Juan
     *               primerApellido:
     *                 type: string
     *                 example: Pérez
     *               segundoApellido:
     *                 type: string
     *                 example: Gómez
     *               nombreDeUsuario:
     *                 type: string
     *                 example: juanperez123
     *               descripcion:
     *                 type: string
     *                 example: Defensa central con gran experiencia.
     *               foto:
     *                 type: string
     *                 example: foto.jpg
     *     responses:
     *       200:
     *         description: Jugador actualizado correctamente
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
     *                   example: "Los datos del jugador fueron actualizados exitosamente."
     *       400:
     *         description: Datos inválidos o incompletos
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
     *                    - "idJugador no encontrado"
     *                    - "el nombre de usuario ingresado ya ha sido registrado previamente"
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
     *                   example: 
     *                     - "Ha ocurrido un error al querer actualizar los datos del jugador."
     *                     - "Ha ocurrido un error en la base de datos al querer editar los datos una cuenta de acceso"
     */
    JugadorEnrutador.put('/:idJugador',ValidarJwt,ControladorJugadorEnrutador.ActualizarJugador);

    /**
     * @swagger
     * /jugador/{idJugador}:
     *   delete:
     *     summary: Eliminar un jugador por su ID
     *     tags: [Jugador]
     *     description: Elimina un jugador del sistema según su ID. Solo usuarios autenticados pueden realizar esta acción.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador a eliminar
     *     responses:
     *       200:
     *         description: Jugador eliminado correctamente
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
     *                   example: El jugador fue eliminado exitosamente.
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
     *                   type: object
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: Jugador no encontrado
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
     *                   example: No se ha encontrado el jugador a eliminar.
     *       500:
     *         description: Error interno del servidor o error en base de datos
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
     *                   example: Ha ocurrido un error al querer borrar el jugador.
     */
    JugadorEnrutador.delete('/:idJugador',ValidarJwt,ControladorJugadorEnrutador.EliminarJugador);

    return JugadorEnrutador;
}