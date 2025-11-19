import { ValidarSeguidor, ValidarSeguidorParcial } from "../schemas/SeguidorValidador.js";
import { logger } from "../utilidades/logger.js";
import { PublicarAccionSocial,EjecutarNotificacion } from "../utilidades/Redis.js";

export class SeguidorControlador
{
    constructor({ModeloSeguidor})
    {
        this.modeloSeguidor = ModeloSeguidor
    }

    RegistrarJugadorASeguir = async (req, res) =>
    {
        try
        {
            const ResultadoValidacion = ValidarSeguidor(req.body);
            const {tipoDeUsuario,nombreDeUsuario} = req;
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloSeguidor.RegistrarJugadorASeguir({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json({
                        error: true,
                        estado: resultadoInsercion,
                        mensaje: 'Ha ocurrido un error al querer seguir al jugador seleccionado.'
                    });
                }
                else
                {
                    if(resultadoInsercion === 200)
                    {
                        const {idJugadorSeguido} = ResultadoValidacion.data;
                        EjecutarNotificacion(()=>PublicarAccionSocial(idJugadorSeguido,'Agregar_seguidor',{mensaje:`${nombreDeUsuario} te ha empezado a seguir.`})); 
                    }
                    res.status(resultadoInsercion).json({
                        error: resultadoInsercion !== 200,
                        estado: resultadoInsercion,
                        mensaje: ResultadoInsercion.mensaje
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer seguir al jugador seleccionado."
            });
        }
    }

    ConsultarSeguidores = async (req, res) =>
    {
        try
        {
            const idJugadorSeguido = parseInt(req.params.idJugadorSeguido);
            const {tipoDeUsuario} = req;
            const Datos = {idJugadorSeguido};
            const ResultadoValidacion = ValidarSeguidorParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloSeguidor.ConsultarJugadoresSeguidores({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {seguidores: ResultadoConsulta.seguidores}
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
                    mensaje: "Ha ocurrido un error al querer consultar los seguidores."
                }
            );
        }
    }

    ConsultarSeguidos = async (req, res) =>
    {
        try
        {
            const idJugadorSeguidor = parseInt(req.params.idJugadorSeguidor);
            const {tipoDeUsuario} = req;
            const Datos = {idJugadorSeguidor};
            const ResultadoValidacion = ValidarSeguidorParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloSeguidor.ConsultarJugadoresSeguidos({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {seguidos: ResultadoConsulta.seguidos}
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
                    mensaje: "Ha ocurrido un error al querer consultar los jugadores seguidos."
                }
            );
        }
    }

    EliminarSeguido = async (req, res) =>
    {
        try
        {
            const {idJugadorSeguidor,idJugadorSeguido} = req.params;
            const Datos = {
                idJugadorSeguidor: Number(idJugadorSeguidor),
                idJugadorSeguido: Number(idJugadorSeguido)
            };
            const ResultadoValidacion = ValidarSeguidor(Datos);
            const {tipoDeUsuario} = req;
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloSeguidor.EliminarJugadorSiguiendo({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion,
                        mensaje: 'Ha ocurrido un error al intentar eliminar el jugador seguido jugador seguido de la lista de seguidos.'
                    });
                }
                else
                {
                    if(resultadoEliminacion === 200)
                    {
                        const {idJugadorSeguido} = ResultadoValidacion.data;
                        EjecutarNotificacion(()=>PublicarAccionSocial(idJugadorSeguido,'Eliminar_seguidor',{mensaje:`Se ha eliminado de seguidos`,idJugadorSeguido: idJugadorSeguido, idJugadorSeguidor: idJugadorSeguidor})); 
                        EjecutarNotificacion(()=>PublicarAccionSocial(idJugadorSeguidor,'Eliminar_seguidor',{mensaje:`Se ha eliminado de seguidos`,idJugadorSeguido: idJugadorSeguido, idJugadorSeguidor: idJugadorSeguidor})); 
                    }
                    res.status(resultadoEliminacion).json(
                        {
                            error: resultadoEliminacion !== 200,
                            estado: resultadoEliminacion,
                            mensaje: ResultadoEliminacion.mensaje
                        }
                    )
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
            logger({mensaje: error});
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer eliminar el jugador seguido de la lista de seguidos."
                }
            );
        }
    } 

}