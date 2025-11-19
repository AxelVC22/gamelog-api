import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos } from '../../utilidades/Constantes.js';

export class ModeloSeguidor
{
    static async RegistrarJugadorASeguir({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugadorSeguidor, idJugadorSeguido} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugadorSeguido',sql.Int,idJugadorSeguido)
                .input('idJugadorSeguidor',sql.Int,idJugadorSeguidor)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Seguidor');
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

    static async ConsultarJugadoresSeguidores({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugadorSeguido} = datos;
            const Solicitud = await conexion.request()
                .input('idJugadorSeguido',sql.Int,idJugadorSeguido)
                .execute('spb_ConsultarJugadoresSeguidores');
            const ResultadoQuerySeguidores = Solicitud.recordset;
            if(ResultadoQuerySeguidores.length >= 1)
            {
                resultadoConsulta = {estado: 200, seguidores: ResultadoQuerySeguidores};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: "No hay jugadores que lo siguen"};
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

    static async ConsultarJugadoresSeguidos({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugadorSeguidor} = datos;
            const Solicitud = await conexion.request()
                .input('idJugadorSeguidor',sql.Int,idJugadorSeguidor)
                .execute('spb_ConsultarJugadoresSeguidos');
            const ResultadoQuerySeguidos = Solicitud.recordset;
            if(ResultadoQuerySeguidos.length >= 1)
            {
                resultadoConsulta = {estado: 200, seguidos: ResultadoQuerySeguidos};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: "No hay jugadores a los que sigues"};
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

    static async EliminarJugadorSiguiendo({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugadorSeguidor, idJugadorSeguido} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugadorSeguidor',sql.Int,idJugadorSeguidor)
                .input('idJugadorSeguido',sql.Int,idJugadorSeguido)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Seguidor');
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