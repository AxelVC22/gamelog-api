import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';

export class ModeloReportesEstadisticos
{
    static async JuegosEnTendencia({datos,tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                fechaInicioBusqueda,
                fechaFinBusqueda
            } = datos;
            const QueryJuegosEnTendencia = await conexion.request()
                .input('fechaInicioBusqueda',sql.Date,fechaInicioBusqueda)
                .input('fechaFinBusqueda',sql.Date,fechaFinBusqueda)
                .execute('spb_JuegosEnTendencia');
            const ResultadoQueryJuegosEnTendencia = QueryJuegosEnTendencia.recordset;
            if(ResultadoQueryJuegosEnTendencia.length >= 1)
            {
                resultadoConsulta = {estado: 200, juegos: ResultadoQueryJuegosEnTendencia};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado juegos reseñados en las fechas seleccionadas.'};
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

    static async JuegosRevivalRetro({datos,tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            conexion = await sql.connect(ConfiguracionConexion);
            const {
                fechaInicioBusqueda,
                fechaFinBusqueda
            } = datos;
            const QueryJuegosRevivalRetro = await conexion.request()
                .input('fechaInicioBusqueda',sql.Date,fechaInicioBusqueda)
                .input('fechaFinBusqueda',sql.Date,fechaFinBusqueda)
                .execute('spb_JuegosRevivalRetro');
            const ResultadoQueryJuegosRevivalRetro = QueryJuegosRevivalRetro.recordset;
            if(ResultadoQueryJuegosRevivalRetro.length >= 1)
            {
                resultadoConsulta = {estado: 200, juegos: ResultadoQueryJuegosRevivalRetro};
            }
            else
            {
                resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado juegos retro que hayan sido reseñados en las fechas seleccionadas.'};
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