# SOS Mascotas Chile

Plataforma comunitaria para ayudar a reencontrar mascotas perdidas con sus familias.

---

## Version 1.2 - Configuracion e integracion corregida

Esta version ajusta detalles tecnicos de la integracion inicial para que el frontend, backend y documentacion apunten al mismo flujo.

### Cambios principales

- Se alinea el servicio de autenticacion del frontend con el puerto real del backend: `8081`.
- Se limpian textos rotos por codificacion en los archivos principales de integracion.
- Se mantienen los mensajes de la simulacion en formato ASCII para evitar problemas de visualizacion.
- Se actualiza la documentacion para reflejar la configuracion actual.

### Configuracion actual de servicios

Backend:

```text
http://localhost:8081
```

Frontend:

```text
http://localhost:5173
```

Endpoint base de autenticacion usado por el frontend:

```text
http://localhost:8081/api/auth
```

---

## Version 1.1 - Documentacion de integracion inicial

Esta version ordena la documentacion de la rama `Develop` para dejar claro que contiene la integracion actual del proyecto y como se relacionan sus partes principales.

### Que contiene esta version

- Frontend en React, Vite, TypeScript y Tailwind CSS.
- Backend en Spring Boot con autenticacion JWT.
- Flujo de registro y login conectado entre frontend y backend.
- Motor inicial de coincidencias para comparar reportes de mascotas.
- Servicio inicial de notificaciones para generar alertas simuladas.
- Simulacion de integracion entre matching y notificaciones.

### Como esta compuesto el proyecto

```text
sos-mascotas-chile/
  frontend/
  backend/
```

### Frontend

El frontend contiene las pantallas, componentes y servicios necesarios para la experiencia de usuario.

Carpetas principales:

- `frontend/src/pages`: vistas principales de la aplicacion.
- `frontend/src/components`: componentes reutilizables.
- `frontend/src/contexts`: manejo de sesion y autenticacion.
- `frontend/src/services`: servicios para consumir datos y endpoints.
- `frontend/src/motor-coincidencias`: logica inicial del motor de matching.
- `frontend/src/servicio-notificaciones`: logica inicial de alertas.

### Backend

El backend contiene la base de autenticacion y usuarios usando Spring Boot.

Carpetas principales:

- `backend/src/main/java/sos_mascotas/backend/controller`: controladores REST.
- `backend/src/main/java/sos_mascotas/backend/service`: logica de negocio.
- `backend/src/main/java/sos_mascotas/backend/repository`: acceso a datos.
- `backend/src/main/java/sos_mascotas/backend/model`: modelos principales.
- `backend/src/main/java/sos_mascotas/backend/DTO`: objetos de entrada y salida.
- `backend/src/main/java/sos_mascotas/backend/config`: seguridad, JWT y filtros.

### Flujo de autenticacion

El registro y login funcionan mediante comunicacion REST entre frontend y backend.

```text
Formulario frontend
-> AuthContext
-> authService
-> AuthController
-> AuthService
-> UserRepository
-> JWT de respuesta
-> Sesion guardada en frontend
```

El frontend guarda el token JWT y el correo del usuario en `localStorage`. Con eso puede mantener la sesion y proteger rutas privadas.

### Flujo de coincidencias y alertas

El motor de coincidencias compara reportes de mascotas usando criterios simples:

- especie
- raza
- color principal
- ubicacion
- fecha del suceso

La especie funciona como filtro obligatorio. Si no coincide, el puntaje queda en `0`. Si coincide, se suman puntos por raza, color, cercania geografica y cercania de fecha.

Cuando el puntaje supera el umbral definido en la simulacion, el servicio de notificaciones crea una alerta para el usuario.

```text
Reporte nuevo o avistamiento
-> Motor de coincidencias
-> Puntaje de coincidencia
-> Servicio de notificaciones
-> Alerta para el usuario
```

### Archivos importantes

- `frontend/src/services/authService.ts`: conecta el frontend con el backend de autenticacion.
- `frontend/src/contexts/AuthContext.tsx`: administra sesion, usuario y token.
- `frontend/src/motor-coincidencias/algoritmo-puntuacion.ts`: calcula el puntaje de coincidencia.
- `frontend/src/servicio-notificaciones/gestor-alertas.ts`: crea y administra alertas simuladas.
- `frontend/src/prueba-integracion-jordan.ts`: simula el flujo entre matching y notificaciones.
- `backend/src/main/java/sos_mascotas/backend/controller/AuthController.java`: expone endpoints de autenticacion.
- `backend/src/main/java/sos_mascotas/backend/service/AuthService.java`: gestiona registro, login y validacion de token.
- `backend/src/main/java/sos_mascotas/backend/repository/UserRepository.java`: acceso a datos de usuarios.
- `backend/src/main/java/sos_mascotas/backend/config/SecurityConfig.java`: configuracion de seguridad.
- `backend/src/main/java/sos_mascotas/backend/config/JwtUtil.java`: generacion y validacion de JWT.

---

## Version 1.0 - Conexion unificada

Este hito registra la primera integracion funcional de los tres pilares del proyecto:

- Frontend de la aplicacion.
- Backend de autenticacion.
- Modulos iniciales de matching y notificaciones.

### Que hace esta version

- Autenticacion real: el frontend se comunica con el backend de Spring Boot para registrar usuarios y hacer login mediante JWT.
- Formulario extendido: se agregaron campos de nombre y telefono requeridos por el modelo de datos.
- Motor de coincidencias v1: se implemento una logica de scoring basada en reglas y formula Haversine.
- Sistema de notificaciones: se agrego una estructura base para alertas de coincidencias.

### Instrucciones de uso local

Backend:

```powershell
cd backend
./mvnw spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8081
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

El frontend queda disponible en:

```text
http://localhost:5173
```

Simulacion de matching:

```powershell
cd frontend
npx tsx src/prueba-integracion-jordan.ts
```

### Resultado esperado de la simulacion

```text
Iniciando simulacion de integracion - SOS Mascotas Chile
Resultado del matching: 100% de coincidencia.
Umbral superado. Generando alerta para el dueno.
Bandeja de entrada del usuario con la notificacion generada.
Simulacion completada con exito.
```
