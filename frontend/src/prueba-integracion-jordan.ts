import { calcularPuntaje } from "./motor-coincidencias/algoritmo-puntuacion.js";
import { crearNotificacionMatch, obtenerNotificaciones } from "./servicio-notificaciones/gestor-alertas.js";

/**
 * Script de prueba para validar que el motor de coincidencia y el
 * servicio de notificaciones funcionan en conjunto.
 */

console.log("Iniciando simulacion de integracion - SOS Mascotas Chile\n");

const mascotaPerdida = {
  id: "UUID-PERDIDA-001",
  usuarioId: "USER-JORDAN-101",
  mascota: {
    especie: "Perro",
    raza: "Labrador",
    colorPrimario: "Dorado",
    nombre: "Bobby",
  },
  ubicacion: { latitud: -33.4489, longitud: -70.6693 },
  fechaSuceso: "2024-05-01T12:00:00Z",
};

const mascotaAvistada = {
  id: "UUID-AVISTAMIENTO-999",
  mascota: {
    especie: "Perro",
    raza: "Labrador",
    colorPrimario: "Dorado",
  },
  ubicacion: { latitud: -33.45, longitud: -70.6685 },
  fechaSuceso: "2024-05-02T10:00:00Z",
};

const scoreFinal = calcularPuntaje(mascotaPerdida, mascotaAvistada);
console.log(`Resultado del matching: ${scoreFinal}% de coincidencia.`);

if (scoreFinal >= 70) {
  console.log("Umbral superado. Generando alerta para el dueno...");
  crearNotificacionMatch(mascotaPerdida.usuarioId, mascotaPerdida.mascota.nombre, scoreFinal);
} else {
  console.log("Puntaje insuficiente para generar notificacion.");
}

const alertasUsuario = obtenerNotificaciones("USER-JORDAN-101");
console.log("\nBandeja de entrada del usuario:");
console.table(alertasUsuario);

console.log("\nSimulacion completada con exito.");
