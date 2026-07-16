import fs from 'fs';

// Esta función lee el CSV y crea el JSON limpio
const procesar = () => {
    try {
        // Leemos el archivo que está en la misma carpeta
        const csv = fs.readFileSync('datos.csv', 'utf8');
        
        // Dividimos el archivo por líneas
        const lineas = csv.split('\n');
        
        // Procesamos los datos saltando la primera línea (cabecera)
        const datos = lineas.slice(1).map(linea => {
            const c = linea.split(',');
            return {
                CLUES: c[0] ? c[0].trim() : "",
                NOMBRE_UNIDAD: c[5] ? c[5].trim() : "",
                ENTIDAD: c[2] ? c[2].trim() : "",
                MUNICIPIO: c[3] ? c[3].trim() : ""
            };
        }).filter(item => item.CLUES !== ""); // Filtra las líneas vacías

        // Guardamos el JSON resultante en la misma carpeta
        fs.writeFileSync('clues.json', JSON.stringify(datos, null, 2));
        
        console.log("¡Éxito! Archivo clues.json creado correctamente.");
    } catch (e) {
        console.log("Error al procesar:", e.message);
    }
};

procesar();