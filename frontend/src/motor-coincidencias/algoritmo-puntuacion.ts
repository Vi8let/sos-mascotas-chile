/**
 * Definicion de interfaces para el Motor de Coincidencias.
 */

export interface Ubicacion {
  latitud: number;
  longitud: number;
}

export interface Mascota {
  especie: string;
  raza: string;
  colorPrimario: string;
  nombre?: string;
}

export interface ReporteMascota {
  id: string;
  usuarioId: string;
  mascota: Mascota;
  ubicacion: Ubicacion;
  fechaSuceso: string;
}

/**
 * Calcula el puntaje de coincidencia entre dos reportes de mascotas.
 * @param reporteExistente - Reporte de mascota ya en la base de datos.
 * @param nuevoReporte - Nuevo reporte entrante a comparar.
 * @returns Score de 0 a 100.
 */
export const calcularPuntaje = (reporteExistente: ReporteMascota, nuevoReporte: Partial<ReporteMascota>): number => {
  let score = 0;

  const m1 = reporteExistente.mascota;
  const m2 = nuevoReporte.mascota;

  if (!m1 || !m2) return 0;

  // 1. Filtro obligatorio: especie.
  if (m1.especie.toLowerCase() !== m2.especie.toLowerCase()) {
    return 0;
  }

  // 2. Raza: 30 puntos.
  if (m1.raza.toLowerCase() === m2.raza.toLowerCase()) {
    score += 30;
  } else if (m1.raza.toLowerCase() === "desconocida" || m2.raza.toLowerCase() === "desconocida") {
    score += 10;
  }

  // 3. Color primario: 20 puntos.
  if (m1.colorPrimario.toLowerCase() === m2.colorPrimario.toLowerCase()) {
    score += 20;
  }

  // 4. Ubicacion: 30 puntos.
  if (reporteExistente.ubicacion && nuevoReporte.ubicacion) {
    const distancia = calcularDistanciaKM(reporteExistente.ubicacion, nuevoReporte.ubicacion);
    if (distancia <= 2) {
      score += 30;
    } else if (distancia <= 5) {
      score += 15;
    }
  }

  // 5. Fecha: 20 puntos.
  if (nuevoReporte.fechaSuceso) {
    const dias = calcularDiferenciaDias(reporteExistente.fechaSuceso, nuevoReporte.fechaSuceso);
    if (dias <= 2) {
      score += 20;
    } else if (dias <= 7) {
      score += 10;
    }
  }

  return score;
};

/**
 * Calcula la distancia en kilometros entre dos puntos geograficos (Formula Haversine).
 */
function calcularDistanciaKM(u1: Ubicacion, u2: Ubicacion): number {
  const R = 6371;
  const dLat = ((u2.latitud - u1.latitud) * Math.PI) / 180;
  const dLon = ((u2.longitud - u1.longitud) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((u1.latitud * Math.PI) / 180) *
      Math.cos((u2.latitud * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calcula la diferencia en dias entre dos fechas.
 */
function calcularDiferenciaDias(f1: string, f2: string): number {
  const fecha1 = new Date(f1);
  const fecha2 = new Date(f2);
  const diffTime = Math.abs(fecha2.getTime() - fecha1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
