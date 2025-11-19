import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import {MensajeDeRetornoBaseDeDatos} from '../../utilidades/Constantes.js';

export class ModeloReseña
{
    static async RegistrarReseña({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idJuego,opinion,calificacion} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idJuego',sql.Int,idJuego)
                .input('opinion',sql.VarChar,opinion)
                .input('calificacion',sql.Decimal(3,1),calificacion)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Reseña');
            resultadoInsercion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async ObtenerReseñasDeJugador({datos, tipoDeUsuario})
    {
        let conexion;
        let resultadoConsulta;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idJugadorBuscador} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsultaReseñasJugador = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idJugadorBuscador',sql.Int,idJugadorBuscador)
                .execute('spb_ObtenerReseñasDeJugador');
            const ResultadoQueryReseñas = ResultadoConsultaReseñasJugador.recordset;
            if(ResultadoQueryReseñas.length >= 1)
            {
                resultadoConsulta = {estado: 200, reseñas: ResultadoQueryReseñas};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado reseñas registradas'};
            }
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoConsulta;
    }

    static async ObtenerReseñasDeUnJuego({datos, tipoDeUsuario})
    {
        let conexion;
        let resultadoConsulta;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego,idJugadorBuscador} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsultaReseñasJugadores = await Solicitud.input('idJuego',sql.Int,idJuego)
                .input('idJugadorBuscador',sql.Int,idJugadorBuscador)
                .execute('spb_ObtenerReseñasDeUnJuego');
            const ResultadoQueryReseñas = ResultadoConsultaReseñasJugadores.recordset;
            if(ResultadoQueryReseñas.length >= 1)
            {
                resultadoConsulta = {estado: 200, reseñas: ResultadoQueryReseñas};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado reseñas registradas por algún jugador'};
            }
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoConsulta;
    }

    static async ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos({datos, tipoDeUsuario})
    {
        let conexion;
        let resultadoConsulta;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego,idJugador} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsultaReseñasJugadoresSeguidos = await Solicitud.input('idJuego',sql.Int,idJuego)
                .input('idJugador',sql.Int,idJugador)
                .execute('spb_ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos');
            const ResultadoQueryReseñas = ResultadoConsultaReseñasJugadoresSeguidos.recordset;
            if(ResultadoQueryReseñas.length >= 1)
            {
                resultadoConsulta = {estado: 200, reseñas: ResultadoQueryReseñas};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado reseñas registradas por jugadores seguidos'};
            }
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoConsulta;
    }

    static async EliminarReseña({datos,tipoDeUsuario})
    {
        let conexion;
        let resultadoEliminacion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idReseña} = datos;
            const Solicitud = conexion.request();
            const ResultadoEliminacion = await Solicitud.input('idReseña',sql.Int,idReseña)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Reseñas');
            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoEliminacion.output});
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }
}