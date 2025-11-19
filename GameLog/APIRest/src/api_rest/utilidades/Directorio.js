import path from 'path';
import { fileURLToPath } from 'url';

export function ObtenerDirectorioActual(metaUrl) {
    const __filename = fileURLToPath(metaUrl);
    return path.dirname(__filename);
}