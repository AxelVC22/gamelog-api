import { ValidarJuego, ValidarJuegoJugador, ValidarJuegoJugadorParcial, ValidarJuegoParcial } from "../schemas/JuegoValidador.js";
import { logger } from "../utilidades/logger.js";

export class JuegoControlador
{
    constructor({ModeloJuego})
    {
        this.modeloJuego = ModeloJuego;
    }

    RegistrarJuego = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarJuego(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloJuego.RegistrarJuego({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar registrar un nuevo juego'
                    });
                }
                else
                {
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
                    mensaje: "Ha ocurrido un error al querer registar el juego"
                }
            );
        }
    }

    RegistrarJuegoFavorito = async (req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarJuegoJugador(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloJuego.RegistrarJuegoFavorito({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar registrar el juego como favorito.'
                    });
                }
                else
                {
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
                    mensaje: "Ha ocurrido un error al querer registar el juego como favorito"
                }
            );
        }
    }

    RegistrarJuegoPendiente = async (req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarJuegoJugador(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloJuego.RegistrarJuegoPendiente({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar registrar el juego a la lista de reseñar más tarde.'
                    });
                }
                else
                {
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
                    mensaje: "Ha ocurrido un error al querer registar el juego a la lista de reseñar más tarde."
                }
            );
        }
    }

    BuscarJuegoPorID = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const Datos = {idJuego};
            const ResultadoValidacion = ValidarJuegoParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJuego.BuscarJuegoPorId({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {juego: ResultadoConsulta.juego}
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
                mensaje: "Ha ocurrido un error al querer buscar el juego por ID"
            }
            );
        }
    }

    BuscarJuegoPorNombre = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const {nombre} = req.query;
            const Datos = {nombre};
            const ResultadoValidacion = ValidarJuegoParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJuego.BuscarJuegoPorNombre({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {juego: ResultadoConsulta.juego}
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
                mensaje: "Ha ocurrido un error al querer buscar el juego por nombre"
            }
            );
        }
    }

    ObtenerJuegosPendientes = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJugador = parseInt(req.params.idJugador);
            const Datos = {idJugador};
            const ResultadoValidacion = ValidarJuegoJugadorParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJuego.ObtenerJuegosPendientes({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
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
                mensaje: "Ha ocurrido un error al querer buscar los juegos para reseñar más tarde"
            }
            )
        }
    }

    ObtenerJuegosFavoritos = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJugador = parseInt(req.params.idJugador);
            const Datos = {idJugador};
            const ResultadoValidacion = ValidarJuegoJugadorParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJuego.ObtenerJuegosFavoritos({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {juegos: ResultadoConsulta.juegos}
                        : {mensaje: ResultadoConsulta.mensaje}
                    )
                })
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
                mensaje: "Ha ocurrido un error al querer buscar los juegos favoritos"
            }
            );
        }
    }

    EliminarJuego = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const Datos = {idJuego};
            const ResultadoValidacion = ValidarJuegoParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloJuego.EliminarJuego({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar eliminar un juego'
                    });
                }
                else
                {
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer eliminar el juego"
            }
            );
        }
    }

    EliminarJuegoPendiente = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const idJugador = parseInt(req.params.idJugador);
            const Datos = {idJuego,idJugador};
            const ResultadoValidacion = ValidarJuegoJugador(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloJuego.EliminarJuegoPendiente({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar eliminar un juego de la lista de reseñar más tarde.'
                    });
                }
                else
                {
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer eliminar el juego de la lista de reseñar más tarde"
            }
            );
        }
    }

    EliminarJuegoFavorito = async (req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const idJugador = parseInt(req.params.idJugador);
            const Datos = {idJuego,idJugador};
            const ResultadoValidacion = ValidarJuegoJugador(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloJuego.EliminarJuegoFavorito({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error al intentar eliminar un juego como favorito'
                    });
                }
                else
                {
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer eliminar el juego como favorito"
            }
            );
        }
    }
}