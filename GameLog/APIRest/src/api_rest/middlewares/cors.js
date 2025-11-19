import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
    'https://localhost:443',
    'http://localhost:80',
]

export const CorsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) || !origin) {
            return callback(null, true);
        }
        return callback(new Error('No se puede enviar solicitudes ni recibir respuestas del servidor.'));
    },
    methods: ['GET', 'PUT', 'PATCH', 'DELETE'],
    credentials: false
});