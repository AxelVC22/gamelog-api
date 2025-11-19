import zod from 'zod';
import { SoloLetras, SoloLetrasNumerosCaracteres, SoloLetrasYNumeros, SoloRutas } from '../utilidades/RegexValidadores.js';

const CuentaEsquema = zod.object(
{
    correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}),
    contrasenia: zod.string({ invalid_type_error: 'La contraseña ingresado no es válido',required_error: 'El contraseña es un campo requerido'}).min(8).max(255),
    estado: zod.string({ invalid_type_error: 'El estado ingresado no es válido',required_error: 'El estado es un campo requerido'}).min(7).max(13).regex(SoloLetras),
    nombre: zod.string({ invalid_type_error: 'El nombre ingresado no es válido',required_error: 'El nombre es un campo requerido'}).min(1).max(80).regex(SoloLetras),
    primerApellido: zod.string({ invalid_type_error: 'El primer apellido ingresado no es válido',required_error: 'El primer apellido es un campo requerido'}).min(1).max(80).regex(SoloLetras),
    segundoApellido: zod.string({ invalid_type_error: 'El segundo apellido no es válido'}).min(0).max(80).regex(SoloLetras).nullable(),
    nombreDeUsuario: zod.string({ invalid_type_error: 'El nombre de usuario ingresado no es válido',required_error: 'El nombre de usuario es un campo requerido'}).min(2).max(20).regex(SoloLetrasYNumeros),
    descripcion: zod.string({ invalid_type_error: 'La descripcion ingresada no es válida'}).min(0).max(200).regex(SoloLetrasNumerosCaracteres).nullable(),
    foto: zod.string({ invalid_type_error: 'La foto ingresada no es válida',required_error: 'La foto de usuario es un campo requerido'}).min(1).max(255).regex(SoloRutas),
    tipoDeUsuario: zod.string({ invalid_type_error: 'El tipo de acceso ingresado no es válido',required_error: 'El tipo de acceso es un campo requerido'}).min(7).max(13).regex(SoloLetras)
}
);

const CuentaEliminacion = zod.object(
{
    idAcceso: zod.number({ invalid_type_error: 'El idAcceso ingresado no es válido',required_error: 'El idAcceso es un campo requerido'}).int().positive().nullable(),
    correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}).nullable(),
    tipoDeUsuario: zod.string({ invalid_type_error: 'El tipo de acceso ingresado no es válido'}).min(7).max(13).regex(SoloLetras)
}
);

const CuentaEsquemaEdicion = zod.object(
{
    idAcceso: zod.number({ invalid_type_error: 'El idAcceso ingresado no es válido',required_error: 'El idAcceso es un campo requerido'}).int().positive(),
    correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}),
    contrasenia: zod.string({ invalid_type_error: 'La contraseña ingresado no es válido',required_error: 'El contraseña es un campo requerido'}),
    estadoAcceso: zod.string({ invalid_type_error: 'El estado ingresado no es válido'}).min(7).max(13).regex(SoloLetras),
    tipoDeUsuario: zod.string({ invalid_type_error: 'El tipo de acceso ingresado no es válido'}).min(7).max(13).regex(SoloLetras)
}
);

export function ValidarInsercionAcceso(entrada)
{
    return CuentaEsquema.safeParse(entrada);
}

export function ValidarEdicionParcialAcceso(entrada)
{
    return CuentaEsquemaEdicion.partial().safeParse(entrada);
}

export function ValidarCredencialesAcceso(entrada)
{
    return CuentaEsquema.partial().safeParse(entrada);
}

export function ValidarEliminacionAcceso(entrada)
{
    return CuentaEliminacion.partial().safeParse(entrada);
}