import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatos } from '../../utilidades/Constantes.js';

export class ModeloJugador
{
    static async ActualizarJugador({datos, tipoDeUsuario})
    {
        let resultadoModificacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const
            {
                idJugador,
                nombre,
                primerApellido,
                segundoApellido,
                nombreDeUsuario,
                descripcion,
                foto
            } = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('nombre',sql.VarChar,nombre)
                .input('primerApellido',sql.VarChar,primerApellido)
                .input('segundoApellido',sql.VarChar,segundoApellido)
                .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                .input('descripcion',sql.VarChar,descripcion)
                .input('foto',sql.VarChar,foto)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spa_Jugadores');
            resultadoModificacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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
        return resultadoModificacion;
    }

    static async BuscarJugador({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                nombreDeUsuario
            } = datos;
            const QueryJugador = await conexion.request()
                .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                .execute('spb_BuscarJugador');
            const ResultadoQueryJugador = QueryJugador.recordset;
            if(ResultadoQueryJugador.length >= 1)
            {
                resultadoConsulta = {estado: 200, cuenta: ResultadoQueryJugador};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado el jugador deseado a buscar.'};
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

    static async EliminarJugador({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const
            {
                idJugador,
            } = datos;
            const Solicitud = await conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Jugador');
            resultadoEliminacion =  MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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
        return resultadoEliminacion
    }
}