import { Router } from "express";
import { ReportesEstadisticosControlador } from "../controllers/ReportesControlador.js";
import { ValidarJwt } from "../middlewares/jwt.js";

export const CrearRutaReportesEstadisticos = ({ModeloReportesEstadisticos}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Reportes estadisticos
     *  description: Rutas para la consultas de los datos para la creación de reportes
     */
    const ReportesEnrutador = Router();
    const ControladorReportesEstadisticos = new ReportesEstadisticosControlador({ModeloReportesEstadisticos});

    /**
     * @swagger
     * /reporte/tendencias/{fechaInicioBusqueda}/{fechaFinBusqueda}:
     *   get:
     *     summary: Obtener juegos en tendencia
     *     tags: [Reportes estadisticos]
     *     description: Retorna los 5 juegos más reseñados dentro del rango de fechas especificado. Requiere autenticación.
     *     security:
     *       - bearerAuth: []  # Requiere token JWT
     *     parameters:
     *       - in: path
     *         name: fechaInicioBusqueda
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de inicio del periodo de búsqueda (formato YYYY-MM-DD)
     *         example: "2025-05-01"
     *       - in: path
     *         name: fechaFinBusqueda
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de fin del periodo de búsqueda (formato YYYY-MM-DD)
     *         example: "2025-05-10"
     *     responses:
     *       200:
     *         description: Lista de juegos en tendencia dentro del periodo especificado
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
     *                         example: 3
     *                       nombre:
     *                         type: string
     *                         example: "The Last Adventure"
     *                       totalReseñas:
     *                         type: integer
     *                         example: 48
     *       400:
     *         description: Fechas inválidas o formato incorrecto
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
     *                   example: { "Datos inválidos" }
     *       404:
     *         description: Sin reseñas de juegos en tendencia encontrados
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
     *                   example: No se ha encontrado juegos reseñados en las fechas seleccionadas.
     *       500:
     *         description: Error interno al obtener el reporte
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
     *                   example: Ha ocurrido un error al obtener los datos para el reporte de juegos en tendencia.
     */
    ReportesEnrutador.get('/tendencias/:fechaInicioBusqueda/:fechaFinBusqueda',ValidarJwt,ControladorReportesEstadisticos.JuegosEnTendencia);

    /**
     * @swagger
     * /reporte/revivalretro/{fechaInicioBusqueda}/{fechaFinBusqueda}:
     *   get:
     *     summary: Obtener juegos retro más reseñados (revival)
     *     tags: [Reportes estadisticos]
     *     description: Devuelve los 5 juegos lanzados antes del año 2000 que han sido más reseñados dentro del rango de fechas proporcionado. Requiere autenticación.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fechaInicioBusqueda
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de inicio del periodo de búsqueda (formato YYYY-MM-DD)
     *         example: "2025-04-01"
     *       - in: path
     *         name: fechaFinBusqueda
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de fin del periodo de búsqueda (formato YYYY-MM-DD)
     *         example: "2025-04-30"
     *     responses:
     *       200:
     *         description: Lista de juegos retro más reseñados durante el periodo especificado
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
     *                         example: "Super Mario Bros."
     *                       totalReseñas:
     *                         type: integer
     *                         example: 37
     *       400:
     *         description: Fechas inválidas o en formato incorrecto
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
     *                   example: { "Datos inválidos" }
     *       404:
     *         description: No se encontraron juegos retro reseñados en ese periodo
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
     *                   example: No se ha encontrado juegos retro que hayan sido reseñados en las fechas seleccionadas.
     *       500:
     *         description: Error del servidor al obtener el reporte
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
     *                   example: Ha ocurrido un error al obtener los datos para el reporte de juegos retro más reseñados.
     */
    ReportesEnrutador.get('/revivalretro/:fechaInicioBusqueda/:fechaFinBusqueda',ValidarJwt,ControladorReportesEstadisticos.JuegosRevivalRetro);

    return ReportesEnrutador;
}