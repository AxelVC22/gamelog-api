import { Router } from "express";
import { AutenticacionControlador } from "../controllers/AutenticacionControlador.js";

export const CrearRutaAutenticacion = () =>
{
    /**
     * @swagger
     * tags:
     *  name: Autenticacion
     *  description: Rutas del inicio de sesion
     */

    const AutenticacionEnrutador = Router();
    const ControladorAutenticacionEnrutador = new AutenticacionControlador();

        AutenticacionEnrutador.post('/',ControladorAutenticacionEnrutador.Autenticar);

    return AutenticacionEnrutador;

}