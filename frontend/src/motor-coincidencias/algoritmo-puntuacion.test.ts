import { describe, expect, it } from "vitest";
import {
  calcularPuntaje,
  cumpleFiltroEspecie,
  estrategiaColor,
  estrategiaFecha,
  estrategiaRaza,
  estrategiaUbicacion,
  ReporteMascota,
} from "./algoritmo-puntuacion";

const reportePerdido: ReporteMascota = {
  id: "PERDIDO-001",
  usuarioId: "USER-001",
  mascota: {
    especie: "Perro",
    raza: "Labrador",
    colorPrimario: "Dorado",
    nombre: "Bobby",
  },
  ubicacion: { latitud: -33.4489, longitud: -70.6693 },
  fechaSuceso: "2024-05-01T12:00:00Z",
};

describe("motor de coincidencias con Strategy Pattern", () => {
  it("retorna 0 si la especie no coincide", () => {
    const reporteGato = {
      mascota: {
        especie: "Gato",
        raza: "Labrador",
        colorPrimario: "Dorado",
      },
      ubicacion: { latitud: -33.4489, longitud: -70.6693 },
      fechaSuceso: "2024-05-01T12:00:00Z",
    };

    expect(cumpleFiltroEspecie(reportePerdido, reporteGato)).toBe(false);
    expect(calcularPuntaje(reportePerdido, reporteGato)).toBe(0);
  });

  it("retorna 0 si faltan datos de mascota en el nuevo reporte", () => {
    expect(calcularPuntaje(reportePerdido, {})).toBe(0);
  });

  it("retorna 100 cuando todos los criterios coinciden", () => {
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Dorado",
      },
      ubicacion: { latitud: -33.45, longitud: -70.6685 },
      fechaSuceso: "2024-05-02T10:00:00Z",
    };

    expect(calcularPuntaje(reportePerdido, avistamiento)).toBe(100);
  });

  it("permite evaluar cada estrategia de forma independiente", () => {
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Desconocida",
        colorPrimario: "Dorado",
      },
      ubicacion: { latitud: -33.48, longitud: -70.68 },
      fechaSuceso: "2024-05-06T10:00:00Z",
    };

    expect(estrategiaRaza.calcular(reportePerdido, avistamiento)).toBe(10);
    expect(estrategiaColor.calcular(reportePerdido, avistamiento)).toBe(20);
    expect(estrategiaUbicacion.calcular(reportePerdido, avistamiento)).toBe(15);
    expect(estrategiaFecha.calcular(reportePerdido, avistamiento)).toBe(10);
  });

  it("no suma ubicacion ni fecha si el avistamiento esta lejos y fuera de rango", () => {
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Dorado",
      },
      ubicacion: { latitud: -36.826, longitud: -73.0498 },
      fechaSuceso: "2024-06-15T10:00:00Z",
    };

    expect(estrategiaUbicacion.calcular(reportePerdido, avistamiento)).toBe(0);
    expect(estrategiaFecha.calcular(reportePerdido, avistamiento)).toBe(0);
    expect(calcularPuntaje(reportePerdido, avistamiento)).toBe(50);
  });

  it("permite reemplazar estrategias sin cambiar el calculador principal", () => {
    const estrategiaSoloRaza = [estrategiaRaza];
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Negro",
      },
      ubicacion: { latitud: -34.0, longitud: -71.0 },
      fechaSuceso: "2024-06-01T10:00:00Z",
    };

    expect(calcularPuntaje(reportePerdido, avistamiento, estrategiaSoloRaza)).toBe(30);
  });
});
