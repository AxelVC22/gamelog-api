import {logger} from '../utilidades/logger.js';
import { ValidarNotificacionParcial } from '../schemas/NotificacionValidador.js';

export class NotificacionControlador
{
    constructor({ModeloNotificacion})
    {
        this.modeloNotificacion = ModeloNotificacion;
    }

    ObtenerNotificaciones = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJugador = parseInt(req.params.idJugador);
            const Datos = {idJugador};
            const ResultadoValidacion = ValidarNotificacionParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloNotificacion.ObtenerNotificaciones({datos: Datos, tipoDeUsuario: tipoDeUsuario});
                let estadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(estadoConsulta).json({
                    error: estadoConsulta !== 200,
                    estado: estadoConsulta,
                    ...(estadoConsulta === 200
                        ? {notificaciones: ResultadoConsulta.notificaciones}
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
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer obtener las notificacion del usuario"
                }
            );
        }
    }

    EliminarNotificacion = async (req, res) => 
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idNotificacion = parseInt(req.params.idNotificacion);
            const Datos = {idNotificacion};
            const ResultadoValidacion = ValidarNotificacionParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloNotificacion.EliminarNotificacion({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let estadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(estadoEliminacion === 500)
                {
                    logger({mensaje: estadoEliminacion.mensaje});
                    res.status(estadoEliminacion).json(
                    {
                        error: true,
                        estado: estadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar eliminar la notificacion'
                    });
                }
                else
                {
                    res.status(estadoEliminacion).json({
                        error: estadoEliminacion !== 200,
                        estado: estadoEliminacion,
                        mensaje: ResultadoEliminacion.mensaje
                    });
                }
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
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer eliminar la notificacion"
                }
            );
        }
    }
}