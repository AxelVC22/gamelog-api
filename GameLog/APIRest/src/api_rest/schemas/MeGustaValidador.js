import zod from 'zod';
import {SoloLetrasNumerosCaracteres } from '../utilidades/RegexValidadores.js';

const MeGustaEsquema = zod.object({
    idJugador: zod.number({ invalid_type_error: 'El idJugador ingresado no es válido',required_error: 'El ID del jugador es un campo requerido' }).int().positive(),
    idResena: zod.number({ invalid_type_error: 'El idReseña ingresado no es válido',required_error: 'El ID de la reseña es un campo requerido'}).int().positive(),
    idJugadorAutor: zod.number({ invalid_type_error: 'El idJugadorAutor ingresado no es válido',required_error: 'El ID de la reseña es un campo requerido'}).int().positive(),
    idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido',required_error: 'El ID de la reseña es un campo requerido'}).int().positive(),
    nombreJuego: zod.string({ invalid_type_error: 'El nombre del juego ingresado no es válido',required_error: 'El nombre del videojuego es un campo requerido'}).min(1).max(100).regex(SoloLetrasNumerosCaracteres)
});


export function ValidarMeGusta(entrada)
{
    return MeGustaEsquema.partial().safeParse(entrada);
}