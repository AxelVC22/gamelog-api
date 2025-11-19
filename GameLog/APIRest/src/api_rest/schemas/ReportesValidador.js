import zod from 'zod';

const FechasEsquema = zod.object(
    {
        fechaInicioBusqueda: zod.date({invalid_type_error: 'La fecha de inicio de búsqueda es incorrecta', required_error: 'La fecha de inicio de búsqueda es un campo requerido'}),
        fechaFinBusqueda: zod.date({invalid_type_error: 'La fecha de fin de búsqueda es incorrecta', required_error: 'La fecha de fin de búsqueda es un campo requerido'})
    }
);

export function ValidarFechasIngresadas(entrada)
{
    return FechasEsquema.safeParse(entrada);
}