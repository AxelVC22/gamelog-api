import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';

export class ModeloLogin
{
    static async Login({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                correo,
                contrasenia
            } = datos;
            const QueryCuenta = await conexion.request()
                .input('correo',sql.VarChar,correo)
                .input('contrasenia',sql.VarChar,contrasenia)
                .execute('spb_BuscarLogin');
            const ResultadoQueryCuenta = QueryCuenta.recordset;
            if(ResultadoQueryCuenta.length >= 1)
            {
                resultadoConsulta = {estado: 200, cuenta: ResultadoQueryCuenta};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'Credenciales incorrectas, no se ha encontrado encontrado la cuenta a ingresar.'};
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
}