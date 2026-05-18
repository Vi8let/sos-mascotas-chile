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

export interface EstrategiaCoincidencia {
  nombre: string;
  puntajeMaximo: number;
  calcular: (reporteExistente: ReporteMascota, nuevoReporte: Partial<ReporteMascota>) => number;
}

const normalizar = (valor?: string) => valor?.trim().toLowerCase() ?? "";

export const cumpleFiltroEspecie = (
  reporteExistente: ReporteMascota,
  nuevoReporte: Partial<ReporteMascota>,
): boolean => {
  const especieExistente = normalizar(reporteExistente.mascota?.especie);
  const especieNueva = normalizar(nuevoReporte.mascota?.especie);
  return Boolean(especieExistente && especieNueva && especieExistente === especieNueva);
};

export const estrategiaRaza: EstrategiaCoincidencia = {
  nombre: "raza",
  puntajeMaximo: 30,
  calcular: (reporteExistente, nuevoReporte) => {
    const razaExistente = normalizar(reporteExistente.mascota?.raza);
    const razaNueva = normalizar(nuevoReporte.mascota?.raza);

    if (!razaExistente || !razaNueva) return 0;
    if (razaExistente === razaNueva) return 30;
    if (razaExistente === "desconocida" || razaNueva === "desconocida") return 10;

    return 0;
  },
};

export const estrategiaColor: EstrategiaCoincidencia = {
  nombre: "color",
  puntajeMaximo: 20,
  calcular: (reporteExistente, nuevoReporte) => {
    const colorExistente = normalizar(reporteExistente.mascota?.colorPrimario);
    const colorNuevo = normalizar(nuevoReporte.mascota?.colorPrimario);

    return colorExistente && colorNuevo && colorExistente === colorNuevo ? 20 : 0;
  },
};

export const estrategiaUbicacion: EstrategiaCoincidencia = {
  nombre: "ubicacion",
  puntajeMaximo: 30,
  calcular: (reporteExistente, nuevoReporte) => {
    if (!reporteExistente.ubicacion || !nuevoReporte.ubicacion) return 0;

    const distancia = calcularDistanciaKM(reporteExistente.ubicacion, nuevoReporte.ubicacion);
    if (distancia <= 2) return 30;
    if (distancia <= 5) return 15;

    return 0;
  },
};

export const estrategiaFecha: EstrategiaCoincidencia = {
  nombre: "fecha",
  puntajeMaximo: 20,
  calcular: (reporteExistente, nuevoReporte) => {
    if (!nuevoReporte.fechaSuceso) return 0;

    const dias = calcularDiferenciaDias(reporteExistente.fechaSuceso, nuevoReporte.fechaSuceso);
    if (dias <= 2) return 20;
    if (dias <= 7) return 10;

    return 0;
  },
};

export const estrategiasCoincidencia: EstrategiaCoincidencia[] = [
  estrategiaRaza,
  estrategiaColor,
  estrategiaUbicacion,
  estrategiaFecha,
];

/**
 * Calcula el puntaje de coincidencia entre dos reportes de mascotas.
 * @param reporteExistente - Reporte de mascota ya en la base de datos.
 * @param nuevoReporte - Nuevo reporte entrante a comparar.
 * @returns Score de 0 a 100.
 */
export const calcularPuntaje = (
  reporteExistente: ReporteMascota,
  nuevoReporte: Partial<ReporteMascota>,
  estrategias: EstrategiaCoincidencia[] = estrategiasCoincidencia,
): number => {
  if (!reporteExistente.mascota || !nuevoReporte.mascota) return 0;
  if (!cumpleFiltroEspecie(reporteExistente, nuevoReporte)) return 0;

  return estrategias.reduce((total, estrategia) => total + estrategia.calcular(reporteExistente, nuevoReporte), 0);
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
