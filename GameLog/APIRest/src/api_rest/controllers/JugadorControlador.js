import { ValidarJugador, ValidarJugadorParcial } from "../schemas/JugadorValidador.js";
import { logger } from "../utilidades/logger.js";

export class JugadorControlador
{
    constructor({ModeloJugador})
    {
        this.modeloJugador = ModeloJugador;
    }

    ActualizarJugador = async (req, res) =>
    {
        try
        {
            const idJugador = parseInt(req.params.idJugador);
            const {nombre,primerApellido,segundoApellido,nombreDeUsuario,descripcion,foto} = req.body;
            const {tipoDeUsuario} = req;
            const Datos = {idJugador,nombre,primerApellido,segundoApellido,nombreDeUsuario,descripcion,foto,tipoDeUsuario};
            const ResultadoValidacion = ValidarJugador(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEdicion = await this.modeloJugador.ActualizarJugador({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEdicion = parseInt(ResultadoEdicion.estado);
                if(resultadoEdicion === 500)
                {
                    logger({mensaje: ResultadoEdicion.mensaje});
                    res.status(resultadoEdicion).json(
                    {
                        error: true,
                        estado: ResultadoEdicion.estado,
                        mensaje: 'Ha ocurrido un error al intentar actualizar el perfil del jugador.'
                    });
                }
                else
                {
                    res.status(resultadoEdicion).json(
                    {
                        error: resultadoEdicion !== 200,
                        estado: ResultadoEdicion.estado,
                        mensaje: ResultadoEdicion.mensaje
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
                mensaje: "Ha ocurrido un error al querer actualizar el perfil del jugador."
            });
        }
    }

    BuscarJugador = async (req, res) => 
    {
        try
        {
            const nombreDeUsuario = req.params.nombreDeUsuario;
            const {tipoDeUsuario} = req;
            const Datos = {nombreDeUsuario};
            const ResultadoValidacion = ValidarJugadorParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJugador.BuscarJugador({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? { cuenta: ResultadoConsulta.cuenta }
                        : { mensaje: ResultadoConsulta.mensaje }
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
                mensaje: "Ha ocurrido un error al querer buscar el jugador."
            });
        }
    }

    EliminarJugador = async(req,res) => 
    {
        try
        {
            const idJugador = parseInt(req.params.idJugador);
            const {tipoDeUsuario} = req;
            const Datos = {idJugador};
            const ResultadoValidacion = ValidarJugadorParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloJugador.EliminarJugador({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: ResultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar eliminar el jugador deseado.'
                    });
                }
                else
                {
                    res.status(resultadoEliminacion).json(
                    {
                        error: resultadoEliminacion !== 200,
                        estado: ResultadoEliminacion.estado,
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer eliminar el jugador deseado."
            });
        }
    }
}