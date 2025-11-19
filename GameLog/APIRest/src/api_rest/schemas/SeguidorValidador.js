import zod from 'zod';

const SeguidorEsquema = zod.object({
    idJugadorSeguido: zod.number({ invalid_type_error: 'El idJugadorSeguido ingresado no es válido',required_error: 'El idJugadorSeguido es un campo requerido' }).int().positive(),
    idJugadorSeguidor: zod.number({ invalid_type_error: 'El idJugadorSeguidor no es válido',required_error: 'El idJugadorSeguidor es un campo requerido' }).int().positive(),
});

export function ValidarSeguidor(entrada)
{
    return SeguidorEsquema.safeParse(entrada);
}

export function ValidarSeguidorParcial(entrada)
{
    return SeguidorEsquema.partial().safeParse(entrada);
}