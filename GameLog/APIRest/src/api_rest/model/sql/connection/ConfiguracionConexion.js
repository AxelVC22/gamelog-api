import dotenv from 'dotenv';
dotenv.config();

const conexionJugador = {
    user: process.env.DB_USUARIOJUGADOR,
    password: process.env.DB_CONTRASENIAJUGADOR,
    server: process.env.DB_SERVIDOR,
    database: process.env.DB_BASEDEDATOS,
    port: parseInt(process.env.DB_PUERTO),
    options: {
        encrypt: process.env.DB_ENCRIPTADO === 'true',
        trustServerCertificate: process.env.DB_CONFIAR_SERVIDOR === 'true'
    }
};

const conexionAdmin = {
    user: process.env.DB_USUARIOADMIN,
    password: process.env.DB_CONTRASENIAADMIN,
    server: process.env.DB_SERVIDOR,
    database: process.env.DB_BASEDEDATOS,
    port: parseInt(process.env.DB_PUERTO),
    options: {
        encrypt: process.env.DB_ENCRIPTADO === 'true',
        trustServerCertificate: process.env.DB_CONFIAR_SERVIDOR === 'true'
    }
};

export function RetornarTipoDeConexion({tipoDeUsuario})
{
    let conexion;
    if(tipoDeUsuario === 'Administrador')
    {
        conexion = conexionAdmin;
    }
    else if(tipoDeUsuario === 'Jugador')
    {
        conexion = conexionJugador;
    }
    return conexion;
};