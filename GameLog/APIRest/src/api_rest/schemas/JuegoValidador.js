import zod from 'zod';
import {SoloLetrasNumerosCaracteres } from '../utilidades/RegexValidadores.js';

const JuegoEsquema = zod.object({
    idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido',required_error: 'El ID del videojuego es un campo requerido' }).int().positive(),
    nombre: zod.string({ invalid_type_error: 'El nombre ingresado no es válido',required_error: 'El nombre del videojuego es un campo requerido'}).min(1).max(100).regex(SoloLetrasNumerosCaracteres),
    fechaDeLanzamiento: zod.string({invalid_type_error: 'La fecha de lanzamiento ingresada no es correcta, debe seguir el formato YYYY-MM-DD',required_error:'La fecha de lanzamiento es un campo requerido'}).date()
});

const JuegoJugadorEsquema = zod.object({
    idJugador: zod.number({ invalid_type_error: 'El idJugador ingresado no es válido',required_error: 'El ID del jugador es un campo requerido' }).int().positive(),
    idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido',required_error: 'El ID del videojuego es un campo requerido' }).int().positive()
});

export function ValidarJuego(entrada)
{
    return JuegoEsquema.safeParse(entrada);
}

export function ValidarJuegoParcial(entrada)
{
    return JuegoEsquema.partial().safeParse(entrada);
}

export function ValidarJuegoJugador(entrada)
{
    return JuegoJugadorEsquema.safeParse(entrada);
}

export function ValidarJuegoJugadorParcial(entrada)
{
    return JuegoJugadorEsquema.partial().safeParse(entrada);
}