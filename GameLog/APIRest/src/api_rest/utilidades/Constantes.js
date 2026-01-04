export function ErrorEnLaBaseDeDatos()
{
    return {estado: 500, mensaje: "Ha ocurrido un error en la base de datos"}
}

export function ErrorEnLaBaseDeDatosInsercion()
{
    return {resultado: 500, mensaje: "Ha ocurrido un error en la base de datos al realizar la inserción"}
}

export function MensajeDeRetornoBaseDeDatos({datos})
{
    const { idResenia,estado, mensaje } = datos;
    return { idResenia, estado, mensaje };
}

export function MensajeDeRetornoBaseDeDatosAcceso({datos})
{
    const { resultado, mensaje } = datos;
    return {resultado, mensaje};
}

export const UsuariosActivos = {};

