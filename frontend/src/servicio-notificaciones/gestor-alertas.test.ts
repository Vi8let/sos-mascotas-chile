import { beforeEach, describe, expect, it } from "vitest";
import {
  crearNotificacionMatch,
  limpiarNotificacionesSimuladas,
  marcarLeida,
  obtenerNotificaciones,
} from "./gestor-alertas";

describe("gestor de alertas", () => {
  beforeEach(() => {
    limpiarNotificacionesSimuladas();
  });

  it("crea una notificacion de prioridad alta si el puntaje supera 85", () => {
    const notificacion = crearNotificacionMatch("USER-001", "Bobby", 100);

    expect(notificacion.prioridad).toBe("ALTA");
    expect(notificacion.leida).toBe(false);
    expect(obtenerNotificaciones("USER-001")).toHaveLength(1);
  });

  it("crea una notificacion de prioridad media si el puntaje no supera 85", () => {
    const notificacion = crearNotificacionMatch("USER-001", "Bobby", 80);

    expect(notificacion.prioridad).toBe("MEDIA");
  });

  it("marca una notificacion como leida", () => {
    const notificacion = crearNotificacionMatch("USER-001", "Bobby", 100);

    marcarLeida(notificacion.id);

    expect(obtenerNotificaciones("USER-001")[0].leida).toBe(true);
  });
});
