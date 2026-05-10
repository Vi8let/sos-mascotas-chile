# Contrato de Eventos: Reporte de Mascota

Este documento define la estructura de datos que el Motor de Coincidencias espera recibir para procesar los matches.

## Estructura del Evento (`ReporteMascotaEvent`)

```json
{
  "id": "string (uuid)",
  "tipoReporte": "PERDIDO | ENCONTRADO | AVISTADO",
  "usuarioId": "string (uuid)",
  "mascota": {
    "especie": "string (perro, gato, etc.)",
    "raza": "string",
    "colorPrimario": "string",
    "colorSecundario": "string",
    "tamano": "PEQUENO | MEDIANO | GRANDE",
    "descripcion": "string"
  },
  "ubicacion": {
    "latitud": "number",
    "longitud": "number",
    "direccionAproximada": "string"
  },
  "fechaSuceso": "ISO8601 String",
  "imagenes": ["string (url)"]
}
```

## Reglas de Negocio para Matching
1. **Especie:** Debe ser idéntica para considerar el match.
2. **Ubicación:** Se priorizan mascotas en un radio de 5km.
3. **Puntuación mínima:** Solo se notificará si el score es mayor al 70%.
