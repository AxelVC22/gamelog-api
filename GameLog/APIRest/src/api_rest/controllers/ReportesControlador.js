import { logger } from "../utilidades/logger.js";
import {ValidarFechasIngresadas} from "../schemas/ReportesValidador.js";

export class ReportesEstadisticosControlador
{
    constructor({ModeloReportesEstadisticos})
    {
        this.modeloReportesEstadisticos = ModeloReportesEstadisticos;
    }

    JuegosEnTendencia = async(req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const {fechaInicioBusqueda,fechaFinBusqueda} = req.params;
            const Datos = {fechaInicioBusqueda: new Date(fechaInicioBusqueda),fechaFinBusqueda: new Date(fechaFinBusqueda)};
            const ResultadoValidacion = ValidarFechasIngresadas(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloReportesEstadisticos.JuegosEnTendencia({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario})
                let resultadoEstadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoEstadoConsulta).json({
                    error: resultadoEstadoConsulta !== 200,
                    estado: resultadoEstadoConsulta,
                    ...(resultadoEstadoConsulta === 200
                        ? {juegos: ResultadoConsulta.juegos}
                        : {mensaje: ResultadoConsulta.mensaje}
                    )
                });
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: 'Datos con formato inválido, por favor verifique los datos enviados.'
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al obtener los datos para el reporte de juegos en tendencia.'
            }
            );
        }
    }

    JuegosRevivalRetro = async(req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const {fechaInicioBusqueda,fechaFinBusqueda} = req.params;
            const Datos = {fechaInicioBusqueda: new Date(fechaInicioBusqueda),fechaFinBusqueda: new Date(fechaFinBusqueda)};
            const ResultadoValidacion = ValidarFechasIngresadas(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsultaRetro = await this.modeloReportesEstadisticos.JuegosRevivalRetro({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoEstadoConsultaRetro = parseInt(ResultadoConsultaRetro.estado);
                res.status(resultadoEstadoConsultaRetro).json({
                    error: resultadoEstadoConsultaRetro !== 200,
                    estado: resultadoEstadoConsultaRetro,
                    ...(resultadoEstadoConsultaRetro === 200
                        ? {juegos: ResultadoConsultaRetro.juegos}
                        : {mensaje: ResultadoConsultaRetro.mensaje}
                    )
                });
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: 'Datos con formato inválido, por favor verifique los datos enviados.'
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al obtener los datos para el reporte de juegos retro más reseñados.'
            }
            );
        }
    }
}