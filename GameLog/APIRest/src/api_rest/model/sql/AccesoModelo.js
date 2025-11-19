import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatos} from '../../utilidades/Constantes.js';

export class ModeloAcceso{

    static async InsertarNuevaCuenta({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        let conexion;
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                correo,
                contrasenia,
                estado,
                nombre,
                primerApellido,
                segundoApellido,
                nombreDeUsuario,
                descripcion,
                foto,
                tipoDeUsuario
            } = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('correo',sql.VarChar,correo)
                .input('contrasenia',sql.VarChar,contrasenia)
                .input('estado',sql.VarChar,estado)
                .input('nombre',sql.VarChar,nombre)
                .input('primerApellido',sql.VarChar,primerApellido)
                .input('segundoApellido',sql.VarChar,segundoApellido)
                .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                .input('descripcion',sql.VarChar,descripcion)
                .input('foto',sql.VarChar,foto)
                .input('tipoDeAcceso',sql.VarChar,tipoDeUsuario)
                .output('resultado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Acceso');
            resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({datos: ResultadoSolicitud.output});
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

    static async ObtenerIdDeAccesoPorCorreo({datos,tipoDeUsuario}){
        let resultadoConsulta;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        let conexion;
        try 
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                correo,
            } = datos;
            const QueryCuenta = await conexion.request()
                .input('correo',sql.VarChar,correo)
                .execute('spb_ObtenerIdDeAccesoPorCorreo');
            const ResultadoIdCuenta = QueryCuenta.recordset;
            if(ResultadoIdCuenta.length >= 1)
            {
                resultadoConsulta = {estado: 200, idAcceso: ResultadoIdCuenta[0].idCuenta};
            }
            else{
                resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado la cuenta a buscar dentro del sistema'};
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

    static async EditarAcceso({datos, tipoDeUsuario})
    {
        let resultadoEdicion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                idAcceso,
                correo,
                contrasenia
            } = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idAcceso',sql.Int,idAcceso)
                .input('correo',sql.VarChar,correo)
                .input('contrasenia',sql.VarChar,contrasenia)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spa_Acceso');
            resultadoEdicion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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
        return resultadoEdicion;
    }

    static async EditarEstadoAcceso({datos, tipoDeUsuario})
    {
        let resultadoEdicion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const
            {
                idAcceso,
                estadoAcceso
            } = datos;
            const Solicitud = await conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idAcceso',sql.Int,idAcceso)
                .input('estadoAcceso',sql.VarChar,estadoAcceso)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spa_EstadoAccesos');
            resultadoEdicion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
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
        return resultadoEdicion;
    }

    static async BorrarAcceso({datos, tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const
            {
                idAcceso,
                correo
            } = datos;
            const Solicitud = await conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idAcceso',sql.Int,idAcceso)
                .input('correo',sql.VarChar,correo)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Acceso');
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
        return resultadoEliminacion;
    }

}