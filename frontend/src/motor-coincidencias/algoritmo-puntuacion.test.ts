import { describe, expect, it } from "vitest";
import {
  calcularPuntaje,
  construirCadenaCoincidencia,
  cumpleFiltroEspecie,
  eslabonColor,
  eslabonFecha,
  eslabonRaza,
  eslabonUbicacion,
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

describe("motor de coincidencias con Cadena de Responsabilidad", () => {
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

  it("permite evaluar cada eslabon de la cadena de forma independiente", () => {
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Desconocida",
        colorPrimario: "Dorado",
      },
      ubicacion: { latitud: -33.48, longitud: -70.68 },
      fechaSuceso: "2024-05-06T10:00:00Z",
    };

    expect(eslabonRaza.calcular(reportePerdido, avistamiento)).toBe(10);
    expect(eslabonColor.calcular(reportePerdido, avistamiento)).toBe(20);
    expect(eslabonUbicacion.calcular(reportePerdido, avistamiento)).toBe(15);
    expect(eslabonFecha.calcular(reportePerdido, avistamiento)).toBe(10);
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

    expect(eslabonUbicacion.calcular(reportePerdido, avistamiento)).toBe(0);
    expect(eslabonFecha.calcular(reportePerdido, avistamiento)).toBe(0);
    expect(calcularPuntaje(reportePerdido, avistamiento)).toBe(50);
  });

  it("permite reemplazar eslabones sin cambiar el calculador principal", () => {
    const cadenaSoloRaza = [eslabonRaza];
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Negro",
      },
      ubicacion: { latitud: -34.0, longitud: -71.0 },
      fechaSuceso: "2024-06-01T10:00:00Z",
    };

    expect(calcularPuntaje(reportePerdido, avistamiento, cadenaSoloRaza)).toBe(30);
  });

  it("delega el calculo desde el primer eslabon hacia el resto de la cadena", () => {
    const avistamiento = {
      mascota: {
        especie: "Perro",
        raza: "Labrador",
        colorPrimario: "Dorado",
      },
      ubicacion: { latitud: -33.45, longitud: -70.6685 },
      fechaSuceso: "2024-05-02T10:00:00Z",
    };

    const inicioCadena = construirCadenaCoincidencia([eslabonRaza, eslabonColor, eslabonUbicacion, eslabonFecha]);

    expect(inicioCadena?.manejar(reportePerdido, avistamiento)).toBe(100);
  });
});
