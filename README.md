# SOS Mascotas Chile

Plataforma comunitaria para ayudar a reencontrar mascotas perdidas con sus familias.

---

## Version 1.7 - BFF/API Gateway y dos microservicios

Esta version deja la arquitectura alineada con la rubrica: frontend, un BFF/API Gateway y dos microservicios backend separados.

### Estado actual

- El proyecto tiene cuatro partes ejecutables: `frontend`, `gateway`, `backend` y `report-service`.
- El `gateway` corre en `http://localhost:9000` y actua como BFF/API Gateway.
- El `backend` corre en `http://localhost:8090` y funciona como microservicio de usuarios/autenticacion.
- El `report-service` corre en `http://localhost:8091` y funciona como microservicio de reportes.
- El frontend corre en `http://localhost:8080` y usa el proxy `/api` de Vite para pasar por el Gateway.
- Los reportes se exponen bajo `/api/reports`, pero el frontend no llama directo al microservicio: entra por el Gateway.
- Las alertas y el motor de coincidencias siguen en frontend como modulos simulados/probados.

### Arquitectura local

```text
Frontend (8080)
-> Vite proxy /api
-> BFF/API Gateway (9000)
   -> user-service/backend (8090)
      -> SQLite backend/db/sos_mascotas.db
   -> report-service (8091)
      -> SQLite report-service/db/report_service.db
```

### Como ejecutar

Microservicio de usuarios/autenticacion:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Microservicio de reportes:

```powershell
cd report-service
.\mvnw.cmd spring-boot:run
```

BFF/API Gateway:

```powershell
cd gateway
..\backend\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

URLs:

```text
Frontend: http://localhost:8080
Gateway:  http://localhost:9000
Backend auth/users: http://localhost:8090
Report service:     http://localhost:8091
```

### Pruebas verificadas

Guia completa (unitarias + Postman): **[docs/PRUEBAS.md](docs/PRUEBAS.md)**

Archivos Postman en la raiz:

- `sos_mascotas_chile_postman_collection.json`
- `sos_mascotas_chile_postman_environment.json`

```powershell
cd backend
.\mvnw.cmd test

cd ..\gateway
..\backend\mvnw.cmd test

cd ..\report-service
.\mvnw.cmd test

cd ..\frontend
npm install
npm test
npm run build
```

Resultado esperado:

- Backend auth/users: 3 tests OK (contexto + registro + login).
- Report service: 2 tests OK.
- Gateway: 4 tests OK (incluye `POST /api/reports` sin token → 401).
- Frontend: 12 tests OK.
- Postman (carpeta «Flujo de verificacion»): Register, Login, 401 sin token, crear reporte con token.

### Evidencia de version

- Rama final integrada: `Develop`.
- Rama base revisada: `origin/Guerben-dev`.
- Tag publicado anterior: `v1.6-avance-guerben-microservicios`.
- Tag propuesto para este avance: `v1.7-bff-dos-microservicios`.
- Tag anterior de referencia: `v1.5-cierre-integracion-microservicios`.

### Cambios principales

- Se separo `report-service/` como microservicio independiente para reportes.
- Se dejo `backend/` enfocado en usuarios, autenticacion, JWT y validacion de token.
- Se actualizo el Gateway para enrutar `/api/auth/**` a `8090` y `/api/reports/**` a `8091`.
- Se sincronizo el secreto JWT entre backend y Gateway.
- Se corrigio CORS para el frontend local.
- Se mantuvieron pruebas basicas para backend, gateway, report-service y frontend.

### Archivos utiles para seguir

- `frontend/src/contrato-eventos.md`
- `frontend/src/motor-coincidencias/algoritmo-puntuacion.ts`
- `frontend/src/servicio-notificaciones/gestor-alertas.ts`
- `backend/src/main/java/sos_mascotas/backend/controller/AuthController.java`
- `report-service/src/main/java/sos_mascotas/report_service/controller/ReportController.java`
- `gateway/src/main/resources/application.yml`

---

## Version 1.6 - Avance Guerben: Gateway y reportes

Esta version integra el avance de la rama `Guerben-dev` sobre la base preparada en `v1.5`.

### Estado de esa version

- El proyecto tenia tres partes ejecutables: `frontend`, `backend` y `gateway`.
- El `gateway` corria en `http://localhost:9000` y actuaba como API Gateway.
- El `backend` corria en `http://localhost:8090` y mantenia autenticacion, usuarios y reportes.
- El frontend corria en `http://localhost:8080` y usaba el proxy `/api` de Vite para pasar por el Gateway.
- El modulo de reportes exponia endpoints bajo `/api/reports`.

### Cambios integrados desde Guerben-dev

- Se agrego `gateway/` con Spring Cloud Gateway.
- Se agrego modulo de reportes en backend: modelo, repositorio, servicio, controlador y DTOs.
- Se movio el backend al puerto `8090`.
- Se dejo el Gateway en el puerto `9000`.
- Se sincronizo el secreto JWT entre backend y Gateway.
- Se agrego coleccion Postman.
- Se corrigieron rutas antiguas hardcodeadas del Gateway.
- Se corrigio CORS para el frontend local.
- Se agregaron pruebas basicas para `ReportService` y `AuthGatewayFilter`.
- Se elimino `gateway/target` del control de versiones y se agrego `target` a `.gitignore`.
- Se retiraron archivos heredados de Supabase para mantener la linea de `Develop` sin esa dependencia.

---

## Version 1.5 - Cierre de integracion para agregar microservicios

Deje esta parte lista para que el equipo pueda seguir agregando microservicios sin mezclar el trabajo del motor de coincidencias con otras tareas.

### Estado actual

- El frontend ya apunta al backend de autenticacion en `http://localhost:8081/api/auth`.

# Definición de Ramas y Tareas – Proyecto Fullstack (Sanos y Salvos)
- Las alertas siguen siendo simuladas, pero ya tienen pruebas de prioridad, lectura y usuarios sin notificaciones.
- La simulacion completa sigue en `frontend/src/prueba-integracion-jordan.ts`.

### Cambios introducidos en la rama **Guerben-dev**
- **Gateway**: todas las peticiones ahora pasan por `http://localhost:9000`; rutas de reports apuntan al backend `:8090`.
- **Postman**: Base URL actualizada a `http://localhost:9000` y valores de enum corregidos (`ANIMAL_PERDIDO`, `OBJETO_PERDIDO`, `ENCONTRADO`).
- **JWT**: secreto sincronizado entre gateway y backend.
- **Java**: versión actualizada a 21 en ambos módulos.
- **Spring Boot**: versión bajada a `3.2.5` para compatibilidad con Spring Cloud 2023.0.3.
- **pom.xml**: dependencias y plugins actualizados en gateway y backend.

### Archivos utiles para seguir

Para agregar nuevos microservicios, estos archivos sirven como punto de partida:

- `frontend/src/contrato-eventos.md`
- `frontend/src/motor-coincidencias/algoritmo-puntuacion.ts`
- `frontend/src/servicio-notificaciones/gestor-alertas.ts`
- `backend/src/main/java/sos_mascotas/backend/controller/AuthController.java`

---

## Version 1.4 - Robustez de matching y alertas

Agregue mas pruebas para cubrir casos que podrian pasar cuando el motor reciba datos incompletos o poco claros.

### Cambios principales

- Reportes incompletos.
- Ubicacion lejana.
- Fecha fuera de rango.
- Usuarios sin notificaciones.
- Alertas inexistentes al marcar como leida.
- Logs del gestor silenciados durante pruebas.

---

## Version 1.3 - Strategy Pattern y pruebas de matching

Separe el motor de coincidencias para que el patron **Strategy** quedara mas claro en el codigo.

### Cambios principales

- El calculo ahora usa estrategias de raza, color, ubicacion y fecha.
- La especie queda como filtro obligatorio.
- Se agregaron pruebas del motor de coincidencias.
- Se agregaron pruebas del servicio de notificaciones.

### Evidencia tecnica

- `frontend/src/motor-coincidencias/algoritmo-puntuacion.ts`
- `frontend/src/motor-coincidencias/algoritmo-puntuacion.test.ts`
- `frontend/src/servicio-notificaciones/gestor-alertas.ts`
- `frontend/src/servicio-notificaciones/gestor-alertas.test.ts`

---

## Version 1.2 - Configuracion e integracion corregida

Corregi detalles de la integracion inicial para que el frontend y el backend quedaran apuntando al mismo flujo.

### Cambios principales

- El servicio de autenticacion del frontend apunta al puerto real del backend: `8081`.
- Limpie textos rotos por codificacion en los archivos principales de integracion.
- Deje los mensajes de la simulacion en ASCII para evitar problemas de visualizacion.
- Actualice el README con la configuracion actual.

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

Ordene el README de la rama `Develop` para explicar que contiene la primera integracion del proyecto.

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

El frontend contiene las pantallas, componentes y servicios principales de la app.

Carpetas principales:

- `frontend/src/pages`: vistas principales de la aplicacion.
- `frontend/src/components`: componentes reutilizables.
- `frontend/src/contexts`: manejo de sesion y autenticacion.
- `frontend/src/services`: servicios para consumir datos y endpoints.
- `frontend/src/motor-coincidencias`: logica inicial del motor de matching.
- `frontend/src/servicio-notificaciones`: logica inicial de alertas.

### Backend

El backend contiene la base de autenticacion y usuarios en Spring Boot.

Carpetas principales:

- `backend/src/main/java/sos_mascotas/backend/controller`: controladores REST.
- `backend/src/main/java/sos_mascotas/backend/service`: logica de negocio.
- `backend/src/main/java/sos_mascotas/backend/repository`: acceso a datos.
- `backend/src/main/java/sos_mascotas/backend/model`: modelos principales.
- `backend/src/main/java/sos_mascotas/backend/DTO`: objetos de entrada y salida.
- `backend/src/main/java/sos_mascotas/backend/config`: seguridad, JWT y filtros.

### Flujo de autenticacion

El registro y login funcionan con comunicacion REST entre frontend y backend.

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

El frontend guarda el token JWT y el correo del usuario en `localStorage`. Con eso mantiene la sesion y protege rutas privadas.

### Flujo de coincidencias y alertas

El motor de coincidencias compara reportes de mascotas usando criterios simples:

- especie
- raza
- color principal
- ubicacion
- fecha del suceso

La especie funciona como filtro obligatorio. Si no coincide, el puntaje queda en `0`. Si coincide, se suman puntos por raza, color, cercania geografica y cercania de fecha.

Cuando el puntaje supera el umbral de la simulacion, el servicio de notificaciones crea una alerta para el usuario.

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

Este hito registra la primera integracion funcional de las partes que unimos:

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
