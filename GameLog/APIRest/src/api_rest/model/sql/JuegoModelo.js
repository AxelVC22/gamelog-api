import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos } from '../../utilidades/Constantes.js';

export class ModeloJuego
{
    static async RegistrarJuego({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego,nombre,fechaDeLanzamiento} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJuego',sql.Int,idJuego)
                .input('nombre',sql.VarChar,nombre)
                .input('fechaDeLanzamiento',sql.Date,fechaDeLanzamiento)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Juegos');
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

    static async RegistrarJuegoPendiente({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego,idJugador} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idJuego',sql.Int,idJuego)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Pendientes');
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

    static async RegistrarJuegoFavorito({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego,idJugador} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idJuego',sql.Int,idJuego)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Favoritos');
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

    static async BuscarJuegoPorNombre({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {nombre} = datos;
            const Solicitud = await conexion.request()
                .input('nombre',sql.VarChar,nombre)
                .execute('spb_BuscarJuegoPorNombre');
            const ResultadoQueryJuego = Solicitud.recordset;
            if(ResultadoQueryJuego.length >= 1)
            {
                resultadoConsulta = {estado: 200, juego: ResultadoQueryJuego};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado el juego deseado a buscar.'};
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

    static async BuscarJuegoPorId({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego} = datos;
            const Solicitud = await conexion.request()
                .input('idJuego',sql.Int,idJuego)
                .execute('spb_BuscarJuegoPorId');
            const ResultadoQueryJuego = Solicitud.recordset;
            if(ResultadoQueryJuego.length >= 1)
            {
                resultadoConsulta = {estado: 200, juego: ResultadoQueryJuego};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado el juego deseado a buscar.'};
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

    static async ObtenerJuegosPendientes({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador} = datos;
            const Solicitud = await conexion.request()
                .input('idJugador',sql.Int,idJugador)
                .execute('spb_ObtenerJuegosPendientes');
            const ResultadoQueryJuegosPendientes = Solicitud.recordset;
            if(ResultadoQueryJuegosPendientes.length >= 1)
            {
                resultadoConsulta = {estado: 200, juegos: ResultadoQueryJuegosPendientes};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado juegos pendientes'};
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

    static async ObtenerJuegosFavoritos({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador} = datos;
            const Solicitud = await conexion.request()
                .input('idJugador',sql.Int,idJugador)
                .execute('spb_ObtenerJuegosFavoritos');
            const ResultadoQueryJuegosFavoritos = Solicitud.recordset;
            if(ResultadoQueryJuegosFavoritos.length >= 1)
            {
                resultadoConsulta = {estado: 200, juegos: ResultadoQueryJuegosFavoritos};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado juegos pendientes'};
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

    static async EliminarJuego({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJuego} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJuego',sql.Int,idJuego)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Juego');
            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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

    static async EliminarJuegoPendiente({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idJuego} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idJuego',sql.Int,idJuego)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Pendientes');
            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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

    static async EliminarJuegoFavorito({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idJuego} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idJuego',sql.Int,idJuego)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Favorito');
            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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