import { Router } from "express";
import { AutenticacionControlador } from "../controllers/AutenticacionControlador.js";

export const CrearRutaAutenticacion = () => {

     /**
     * @swagger
     * tags:
     *  name: Autenticacion
     *  description: Gestión de las renovación de tokens
     */
     const AutenticacionEnrutador = Router();
    const ControladorAutenticacionEnrutador = new AutenticacionControlador();

    /**
 * @swagger
 * /gamelog/autenticacion:
 *   post:
 *     summary: Renueva los tokens de autenticación usando un refresh token válido
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de renovación emitido previamente
 *     responses:
 *       200:
 *         description: Tokens renovados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Nuevo token de acceso
 *                 refreshToken:
 *                   type: string
 *                   description: Nuevo refresh token (rotado)
 *       401:
 *         description: Refresh token inválido o expirado
 *       403:
 *         description: Refresh token revocado
 */



    AutenticacionEnrutador.post('/', ControladorAutenticacionEnrutador.Autenticar);

    return AutenticacionEnrutador;

}