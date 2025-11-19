import { logger } from "../utilidades/logger.js";
import { ValidarMeGusta } from "../schemas/MeGustaValidador.js";
import { PublicarAccionReseña, PublicarAccionSocial, EjecutarNotificacion } from "../utilidades/Redis.js";

export class MeGustaControlador
{
    constructor({ModeloMeGusta})
    {
        this.modeloMeGusta = ModeloMeGusta;
    }

    RegistrarMeGustaAReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario,nombreDeUsuario} = req;
            const NombreDeUsuario = nombreDeUsuario;
            const ResultadoValidacion = ValidarMeGusta(req.body);
            if(ResultadoValidacion.success)
            {
                const {idJugadorAutor,idJuego,nombreJuego} = ResultadoValidacion.data;
                const MensajeNotificacion = `${NombreDeUsuario} le ha dado me gusta a tu reseña sobre ${nombreJuego}`;
                const ResultadoInsercion = await this.modeloMeGusta.RegistrarMeGustaAReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario, mensaje: MensajeNotificacion});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar darle me gusta a una reseña'
                    });
                }
                else
                {
                    if(resultadoInsercion === 200)
                    {
                        EjecutarNotificacion(()=>PublicarAccionReseña(idJuego,'Dar_MeGusta',{mensaje: `${NombreDeUsuario} ha dado un me gusta a una reseña`, idResena: ResultadoValidacion.data.idResena, jugadorEmitente: nombreDeUsuario})); 
                        EjecutarNotificacion(()=>PublicarAccionSocial(idJugadorAutor,'Interactuar_resena',{mensaje: MensajeNotificacion}));
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
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer registar el me gusta a la reseña"
                }
            );
        }
    }

    EliminarMeGustaDeReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario,nombreDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const {idResena,idJugadorAutor,idJugador,nombreJuego} = req.body;
            const Datos = {idJugador,idResena,idJugadorAutor,idJuego,nombreJuego};
            const ResultadoValidacion = ValidarMeGusta(Datos);
            if(ResultadoValidacion.success)
            {
                const {idJugadorAutor,idJuego,nombreJuego} = ResultadoValidacion.data;
                const MensajeNotificacion = `${nombreDeUsuario} le ha dado me gusta a tu reseña sobre ${nombreJuego}`;
                const ResultadoEliminacion = await this.modeloMeGusta.EliminarMeGustaDeReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario, mensaje: MensajeNotificacion});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: resultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar eliminar el me gusta de una reseña'
                    });
                }
                else
                {
                    if(resultadoEliminacion === 200)
                    {
                        EjecutarNotificacion(()=>PublicarAccionReseña(idJuego,'Quitar_MeGusta',{mensaje: `${nombreDeUsuario} ha quitado un me gusta a una reseña`,idResena: ResultadoValidacion.data.idResena}));
                        EjecutarNotificacion(()=>PublicarAccionSocial(idJugadorAutor,'Desvincular_rnteraccion_resena',{mensaje:`${nombreDeUsuario} ha eliminado un me gusta de una de tus reseñas`}));
                    }
                    res.status(resultadoEliminacion).json({
                        error: resultadoEliminacion !== 200,
                        estado: resultadoEliminacion,
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
                    mensaje: "Ha ocurrido un error al querer eliminar el me gusta a la reseña"
                }
            );
        }
    }
}