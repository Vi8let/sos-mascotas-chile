# SOS Mascotas Chile

Plataforma comunitaria para ayudar a reencontrar mascotas perdidas con sus familias.

---

## 🚀 Prueba 1.0 - Conexión Unificada (Hito Actual)

Este hito registra la integración funcional de los tres pilares del proyecto. Ya es posible realizar el flujo completo de autenticación contra el servidor real.

### ¿Qué hace esta versión?
- **Autenticación Real:** El frontend (Paz) se comunica con el backend de Spring Boot (Guerben) para registrar usuarios y hacer login mediante JWT.
- **Formulario Extendido:** Se agregaron campos de Nombre y Teléfono requeridos por el modelo de datos.
- **Motor de Coincidencias (v1):** Implementación de la lógica de scoring basada en la fórmula Haversine (Jordan).
- **Sistema de Notificaciones:** Estructura base para alertas de coincidencias lista para integración visual.

### Instrucciones para Probar
Para validar esta versión, sigue estos pasos:

1.  **Backend (Spring Boot):**
    - Entra a la carpeta `backend/`.
    - Asegúrate de tener Java 17+ instalado.
    - Ejecuta el proyecto (ej. `./mvnw spring-boot:run` o desde tu IDE). El servidor iniciará en el puerto **8080**.

2.  **Frontend (React + Vite):**
    - Entra a la carpeta `frontend/`.
    - Ejecuta `npm install` y luego `npm run dev`.
    - Accede a `http://localhost:5173`.

3.  **Ejecutar Simulación de Inteligencia (Matching):**
    - Abre una tercera terminal.
    - Ejecuta:
    ```powershell
    cd frontend
    npx tsx src/prueba-integracion-jordan.ts
    ```

### ✅ Deberías ver como resultado:
Al ejecutar la simulación, la terminal debería mostrar un log similar a este:
```text
🚀 Iniciando Simulación de Integración - SOS Mascotas Chile
📍 Resultado del Matching: 100% de coincidencia.
✅ Umbral superado. Generando alerta para el dueño...
🔔 Bandeja de entrada del usuario: (Se muestra tabla con la notificación para 'Bobby')
✅ Simulación completada con éxito.
```

---
