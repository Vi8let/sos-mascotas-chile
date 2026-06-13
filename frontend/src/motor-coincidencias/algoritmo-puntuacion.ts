/**
 * Definicion de interfaces para el Motor de Coincidencias.
 * El calculo usa Cadena de Responsabilidad: cada eslabon aporta su puntaje
 * y delega al siguiente criterio sin mezclar las reglas entre si.
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

export interface EslabonCoincidencia {
  nombre: string;
  puntajeMaximo: number;
  calcular: (reporteExistente: ReporteMascota, nuevoReporte: Partial<ReporteMascota>) => number;
  setSiguiente: (siguiente?: EslabonCoincidencia) => EslabonCoincidencia | undefined;
  manejar: (reporteExistente: ReporteMascota, nuevoReporte: Partial<ReporteMascota>) => number;
}

const normalizar = (valor?: string) => valor?.trim().toLowerCase() ?? "";

const crearEslabon = (
  nombre: string,
  puntajeMaximo: number,
  calcular: (reporteExistente: ReporteMascota, nuevoReporte: Partial<ReporteMascota>) => number,
): EslabonCoincidencia => {
  let siguiente: EslabonCoincidencia | undefined;

  return {
    nombre,
    puntajeMaximo,
    calcular,
    setSiguiente: (nuevoSiguiente) => {
      siguiente = nuevoSiguiente;
      return nuevoSiguiente;
    },
    manejar: (reporteExistente, nuevoReporte) =>
      calcular(reporteExistente, nuevoReporte) + (siguiente?.manejar(reporteExistente, nuevoReporte) ?? 0),
  };
};

export const cumpleFiltroEspecie = (
  reporteExistente: ReporteMascota,
  nuevoReporte: Partial<ReporteMascota>,
): boolean => {
  const especieExistente = normalizar(reporteExistente.mascota?.especie);
  const especieNueva = normalizar(nuevoReporte.mascota?.especie);
  return Boolean(especieExistente && especieNueva && especieExistente === especieNueva);
};

export const eslabonRaza: EslabonCoincidencia = crearEslabon(
  "raza",
  30,
  (reporteExistente, nuevoReporte) => {
    const razaExistente = normalizar(reporteExistente.mascota?.raza);
    const razaNueva = normalizar(nuevoReporte.mascota?.raza);

    if (!razaExistente || !razaNueva) return 0;
    if (razaExistente === razaNueva) return 30;
    if (razaExistente === "desconocida" || razaNueva === "desconocida") return 10;

    return 0;
  },
);

export const eslabonColor: EslabonCoincidencia = crearEslabon(
  "color",
  20,
  (reporteExistente, nuevoReporte) => {
    const colorExistente = normalizar(reporteExistente.mascota?.colorPrimario);
    const colorNuevo = normalizar(nuevoReporte.mascota?.colorPrimario);

    return colorExistente && colorNuevo && colorExistente === colorNuevo ? 20 : 0;
  },
);

export const eslabonUbicacion: EslabonCoincidencia = crearEslabon(
  "ubicacion",
  30,
  (reporteExistente, nuevoReporte) => {
    if (!reporteExistente.ubicacion || !nuevoReporte.ubicacion) return 0;

    const distancia = calcularDistanciaKM(reporteExistente.ubicacion, nuevoReporte.ubicacion);
    if (distancia <= 2) return 30;
    if (distancia <= 5) return 15;

    return 0;
  },
);

export const eslabonFecha: EslabonCoincidencia = crearEslabon(
  "fecha",
  20,
  (reporteExistente, nuevoReporte) => {
    if (!nuevoReporte.fechaSuceso) return 0;

    const dias = calcularDiferenciaDias(reporteExistente.fechaSuceso, nuevoReporte.fechaSuceso);
    if (dias <= 2) return 20;
    if (dias <= 7) return 10;

    return 0;
  },
);

export const eslabonesCoincidencia: EslabonCoincidencia[] = [
  eslabonRaza,
  eslabonColor,
  eslabonUbicacion,
  eslabonFecha,
];

export type EstrategiaCoincidencia = EslabonCoincidencia;
export const estrategiaRaza = eslabonRaza;
export const estrategiaColor = eslabonColor;
export const estrategiaUbicacion = eslabonUbicacion;
export const estrategiaFecha = eslabonFecha;
export const estrategiasCoincidencia = eslabonesCoincidencia;

export const construirCadenaCoincidencia = (eslabones: EslabonCoincidencia[]): EslabonCoincidencia | undefined => {
  eslabones.forEach((eslabon, index) => {
    eslabon.setSiguiente(eslabones[index + 1]);
  });

  return eslabones[0];
};

/**
 * Calcula el puntaje de coincidencia entre dos reportes de mascotas.
 * @param reporteExistente - Reporte de mascota ya en la base de datos.
 * @param nuevoReporte - Nuevo reporte entrante a comparar.
 * @returns Score de 0 a 100.
 */
export const calcularPuntaje = (
  reporteExistente: ReporteMascota,
  nuevoReporte: Partial<ReporteMascota>,
  eslabones: EslabonCoincidencia[] = eslabonesCoincidencia,
): number => {
  if (!reporteExistente.mascota || !nuevoReporte.mascota) return 0;
  if (!cumpleFiltroEspecie(reporteExistente, nuevoReporte)) return 0;

  return construirCadenaCoincidencia(eslabones)?.manejar(reporteExistente, nuevoReporte) ?? 0;
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
