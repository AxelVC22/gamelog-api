import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import {MensajeDeRetornoBaseDeDatos} from '../../utilidades/Constantes.js';

export class ModeloNotificacion
{
    static async ObtenerNotificaciones({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador} = datos;
            const Solicitud = conexion.request();
            const ResultadoConsulta = await Solicitud.input('idJugador',sql.Int,idJugador)
                .execute('spb_ObtenerNotificaciones');
            const ResultadoQueryNotificaciones = ResultadoConsulta.recordset;
            if(ResultadoQueryNotificaciones.length >= 1)
            {
                resultadoConsulta = {estado: 200, notificaciones: ResultadoQueryNotificaciones};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se han encontrado notificaciones por mostrar'};
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

    static async EliminarNotificacion({datos,tipoDeUsuario})
    {
        let conexion;
        let resultadoEliminacion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idNotificacion} = datos;
            const Solicitud = conexion.request();
            const ResultadoEliminacion = await Solicitud.input('idNotificacion',sql.Int,idNotificacion)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Notificaciones');
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