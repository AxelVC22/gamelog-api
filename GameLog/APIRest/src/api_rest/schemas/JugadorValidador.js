import zod from 'zod';
import { SoloLetras, SoloLetrasNumerosCaracteres, SoloLetrasYNumeros, SoloRutas} from '../utilidades/RegexValidadores.js';

const JugadorEsquema = zod.object({
    idJugador: zod.number({ invalid_type_error: 'El idJugador ingresado no es válido',required_error: 'El ID del jugador es un campo requerido'}).int().positive(),
    nombre: zod.string({ invalid_type_error: 'El nombre ingresado no es válido',required_error: 'El nombre del jugador es un campo requerido' }).min(1).max(80).regex(SoloLetras).nullable(),
    primerApellido: zod.string({ invalid_type_error: 'El primer apellido ingresado no es válido',required_error: 'El primer apellido del jugador es un campo requerido' }).min(1).max(80).regex(SoloLetras).nullable(),
    segundoApellido: zod.string({ invalid_type_error: 'El segundo apellido no es válido'}).min(0).max(80).regex(SoloLetras).optional(), 
    nombreDeUsuario: zod.string({ invalid_type_error: 'El nombre de usuario ingresado no es válido',required_error: 'El nombre de usuario del jugador es un campo requerido' }).min(2).max(20).regex(SoloLetrasYNumeros).nullable(),
    descripcion: zod.string({ invalid_type_error: 'La descripcion ingresada no es válida'}).min(0).max(200).regex(SoloLetrasNumerosCaracteres).optional(), 
    foto: zod.string({ invalid_type_error: 'La foto ingresada no es válida',required_error: 'La foto del jugador es un campo requerido'}).min(1).max(255).regex(SoloRutas).nullable()
});


export function ValidarJugador(entrada)
{
    return JugadorEsquema.safeParse(entrada);
}

export function ValidarJugadorParcial(entrada)
{
    return JugadorEsquema.partial().safeParse(entrada);
}