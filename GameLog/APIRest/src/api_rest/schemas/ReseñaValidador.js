import zod from 'zod';
import { SoloLetrasNumerosCaracteres } from '../utilidades/RegexValidadores.js';

const ReseñaEsquemaInsercion = zod.object(
    {
        idJugador: zod.number({ invalid_type_error: 'El idJugador ingresado no es válido',required_error: 'El idJugador es un campo requerido' }).int().positive(),
        idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido',required_error: 'El idJuego es un campo requerido' }).int().positive(),
        opinion: zod.string({ invalid_type_error: 'La opinión ingresada no es válido'}).min(0).max(200).regex(SoloLetrasNumerosCaracteres).nullable(),
        calificacion: zod.number({ invalid_type_error: 'La calificacion ingresada no es válido',required_error: 'La calificacion es un campo requerido' }).min(0).max(5)
    }
);

const ReseñaBusqueda = zod.object(
    {
        idJugador: zod.number({ invalid_type_error: 'El idJugador ingresado no es válido'}).int().positive(),
        idJugadorBuscador: zod.number({invalid_type_error: 'El idJugadorBuscador ingresado no es válido'}),
        idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido'}).int().positive(),
        idReseña: zod.number({ invalid_type_error: 'El idReseña ingresado no es válido'}).int().positive(),
    }
);

export function ValidarDatosReseña(entrada)
{
    return ReseñaEsquemaInsercion.safeParse(entrada);
}

export function ValidarDatosBusquedaReseña(entrada)
{
    return ReseñaBusqueda.partial().safeParse(entrada);
}