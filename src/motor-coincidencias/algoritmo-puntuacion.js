/**
 * Calcula el puntaje de coincidencia entre dos reportes de mascotas.
 * @param {Object} reporteExistente - Reporte de mascota ya en la base de datos.
 * @param {Object} nuevoReporte - Nuevo reporte entrante a comparar.
 * @returns {number} Score de 0 a 100.
 */
export const calcularPuntaje = (reporteExistente, nuevoReporte) => {
    let score = 0;

    const m1 = reporteExistente.mascota;
    const m2 = nuevoReporte.mascota;

    // 1. Filtro obligatorio: Especie
    if (m1.especie.toLowerCase() !== m2.especie.toLowerCase()) {
        return 0;
    }

    // 2. Raza (30 puntos)
    if (m1.raza.toLowerCase() === m2.raza.toLowerCase()) {
        score += 30;
    } else if (m1.raza.toLowerCase() === 'desconocida' || m2.raza.toLowerCase() === 'desconocida') {
        score += 10;
    }

    // 3. Color Primario (20 puntos)
    if (m1.colorPrimario.toLowerCase() === m2.colorPrimario.toLowerCase()) {
        score += 20;
    }

    // 4. Ubicación (30 puntos)
    // Se utiliza una función auxiliar para calcular la distancia en KM
    const distancia = calcularDistanciaKM(reporteExistente.ubicacion, nuevoReporte.ubicacion);
    if (distancia <= 2) {
        score += 30;
    } else if (distancia <= 5) {
        score += 15;
    }

    // 5. Fecha (20 puntos)
    const dias = calcularDiferenciaDias(reporteExistente.fechaSuceso, nuevoReporte.fechaSuceso);
    if (dias <= 2) {
        score += 20;
    } else if (dias <= 7) {
        score += 10;
    }

    return score;
};

/**
 * Calcula la distancia en kilómetros entre dos puntos geográficos (Fórmula simplificada).
 */
function calcularDistanciaKM(u1, u2) {
    if (!u1 || !u2) return 999;
    
    const R = 6371; // Radio de la Tierra en KM
    const dLat = (u2.latitud - u1.latitud) * Math.PI / 180;
    const dLon = (u2.longitud - u1.longitud) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(u1.latitud * Math.PI / 180) * Math.cos(u2.latitud * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Calcula la diferencia en días entre dos fechas.
 */
function calcularDiferenciaDias(f1, f2) {
    const fecha1 = new Date(f1);
    const fecha2 = new Date(f2);
    const diffTime = Math.abs(fecha2 - fecha1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
