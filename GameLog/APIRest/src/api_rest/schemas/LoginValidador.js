import zod from 'zod';
import { SoloLetras } from '../utilidades/RegexValidadores.js';

const LoginEsquema = zod.object(
    {
        correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido',required_error: 'El correo es un campo requerido'}),
        contrasenia: zod.string({ invalid_type_error: 'La contraseña ingresado no es válido',required_error: 'El contraseña es un campo requerido'}).min(8).max(255),
        tipoDeUsuario: zod.string({ invalid_type_error: 'El tipo de acceso ingresado no es válido',required_error: 'El tipo de acceso es un campo requerido'}).min(7).max(13).regex(SoloLetras)
    }
);

const RecuperacionCuentaEsquema = zod.object(
    {
        correo: zod.string().email({ invalid_type_error: 'El correo ingresado no es válido'}),
        codigo: zod.number({ invalid_type_error: 'El codigo de verificacion ingresado no es válido'}).int().min(100000).max(999999),
        tipoDeUsuario: zod.string({ invalid_type_error: 'El tipo de acceso ingresado no es válido',required_error: 'El tipo de acceso es un campo requerido'}).min(7).max(13).regex(SoloLetras)
    }
);

export function ValidarDatosLoginIngresados(entrada)
{
    return LoginEsquema.safeParse(entrada);
}

export function ValidarDatosLoginParcialIngresados(entrada)
{
    return LoginEsquema.partial().safeParse(entrada);
}

export function ValidarRecuperacionCuenta(entrada)
{
    return RecuperacionCuentaEsquema.partial().safeParse(entrada);
}