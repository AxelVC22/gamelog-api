import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import {MensajeDeRetornoBaseDeDatos} from '../../utilidades/Constantes.js';

export class ModeloMeGusta
{

    static async RegistrarMeGustaAReseña({datos, tipoDeUsuario, mensaje})
    {
        let resultadoInsercion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idResena} = datos;
            const MensajeNotificacion = mensaje;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idResenia',sql.Int,idResena)
                .input('mensajeNotificacion',sql.VarChar,MensajeNotificacion)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_MeGusta');
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

    static async EliminarMeGustaDeReseña({datos,tipoDeUsuario,mensaje})
    {
        let resultadoEliminacion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idResena} = datos;
            const MensajeNotificacion = mensaje;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idResenia',sql.Int,idResena)
                .input('idJugador',sql.Int,idJugador)
                .input('mensajeNotificacion',sql.VarChar,MensajeNotificacion)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_MeGusta');
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