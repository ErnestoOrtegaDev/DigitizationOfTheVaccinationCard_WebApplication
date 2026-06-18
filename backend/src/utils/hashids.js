import Hashids from 'hashids';
import dotenv from 'dotenv';

dotenv.config();

// Configuramos Hashids con la variable de entorno o un valor por defecto seguro
const hashids = new Hashids(
    process.env.HASHIDS_SALT || 'VacunAppMX_SuperSecretSalt_2026!', 
    parseInt(process.env.HASHIDS_LENGTH) || 8
);

// Convierte un INT (ej. 1) a String (ej. "Xz8yA2bN")
export const encodeId = (id) => {
    if (!id) return null;
    return hashids.encode(id);
};

// Convierte un String (ej. "Xz8yA2bN") de vuelta a INT (ej. 1)
export const decodeId = (hashedId) => {
    if (!hashedId) return null;
    const decoded = hashids.decode(hashedId);
    return decoded.length > 0 ? decoded[0] : null;
};