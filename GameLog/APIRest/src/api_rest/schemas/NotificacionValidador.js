import zod from "zod";

const NotificacionEsquema = zod.object({
    idNotificacion: zod.number({invalid_type_error: 'El idNotificacion ingresado no es valido'}).int().positive(),
    idJugador: zod.number({invalid_type_error: 'El idJugador ingresado no es válido'}).int().positive()
});

export function ValidarNotificacionParcial(entrada)
{
    return NotificacionEsquema.partial().safeParse(entrada);
}