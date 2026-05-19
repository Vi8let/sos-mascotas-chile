# Elementos probados en SOS Mascotas Chile

Este documento describe **qué componentes y comportamientos** cubre la suite de pruebas, de frontend a gateway. No incluye instrucciones de ejecución (ver [PRUEBAS.md](PRUEBAS.md)).

---

## Frontend

Módulos simulados del dominio en el cliente. No se prueban componentes React ni llamadas HTTP reales.

### Motor de coincidencias (`algoritmo-puntuacion`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| `cumpleFiltroEspecie` | Rechaza comparación cuando la especie del avistamiento no coincide con el reporte perdido |
| `calcularPuntaje` | Devuelve **0** si la especie no coincide |
| `calcularPuntaje` | Devuelve **0** si el avistamiento no trae datos de mascota |
| `calcularPuntaje` | Devuelve **100** cuando especie, raza, color, ubicación y fecha están alineados |
| `estrategiaRaza` | Puntaje parcial por coincidencia de raza (ej. raza distinta → 10 pts) |
| `estrategiaColor` | Puntaje parcial por color (ej. 20 pts) |
| `estrategiaUbicacion` | Puntaje por proximidad geográfica (ej. 15 pts) |
| `estrategiaFecha` | Puntaje por cercanía temporal del suceso (ej. 10 pts) |
| `estrategiaUbicacion` / `estrategiaFecha` | Devuelven **0** si el avistamiento está lejos en espacio y tiempo |
| `calcularPuntaje` (con lista custom de estrategias) | Permite sustituir estrategias sin alterar el calculador principal (solo raza → 30 pts) |

### Servicio de notificaciones (`gestor-alertas`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| `crearNotificacionMatch` | Prioridad **ALTA** cuando el puntaje de coincidencia es mayor a 85 |
| `crearNotificacionMatch` | Prioridad **MEDIA** cuando el puntaje no supera 85 |
| `crearNotificacionMatch` | La notificación nace como no leída |
| `obtenerNotificaciones` | Lista las notificaciones del usuario que las recibió |
| `obtenerNotificaciones` | Devuelve lista vacía para un usuario sin alertas |
| `marcarLeida` | Marca una notificación existente como leída |
| `marcarLeida` | No lanza error si el id no existe (comportamiento tolerante) |

### Smoke de Vitest (`example.test.ts`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| Runner Vitest | La configuración de pruebas del frontend puede ejecutar un caso mínimo |

---

## Backend — microservicio de usuarios (`backend`)

### Contexto de aplicación (`BackendApplicationTests`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| Contexto Spring Boot | El contenedor de dependencias del microservicio arranca sin errores de configuración |

### Servicio de autenticación (`AuthService`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| `register` | Persiste usuario con email, nombre y teléfono del request |
| `register` | Guarda la contraseña **codificada** (no en texto plano) |
| `register` | Asigna rol `USER` al nuevo usuario |
| `register` | Respuesta incluye JWT, email y rol `USER` |
| `login` | Invoca autenticación de Spring Security con credenciales del request |
| `login` | Respuesta incluye JWT, email y rol del usuario encontrado |

**No cubierto en unitarios:** `validateToken`, endpoints del `AuthController` ni reglas de `SecurityConfig` (solo indirectamente vía contexto).

---

## Report service — microservicio de reportes (`report-service`)

### Servicio de reportes (`ReportService`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| `create` | Valida el token contra el servicio de usuarios (`UserServiceClient`) |
| `create` | Asigna `autorId` del usuario autenticado al reporte guardado |
| `create` | Respuesta refleja título del request y nombre de autor derivado (`usuario-{id}`) |
| `getById` | Lanza excepción con mensaje «Reporte no encontrado» si el id no existe |

**No cubierto en unitarios:** `list`, `updateEstado`, `delete`, `ReportController` ni persistencia real en SQLite.

---

## Gateway — BFF (`gateway`)

### Filtro global de autenticación (`AuthGatewayFilter`)

| Elemento | Comportamiento verificado |
|----------|---------------------------|
| Rutas protegidas (`GET /api/reports`) | Responde **401** si falta header `Authorization: Bearer …` |
| Rutas protegidas (`POST /api/reports`) | Responde **401** si falta Bearer (crear reporte sin token) |
| Rutas protegidas sin token | No delega la petición al siguiente filtro de la cadena |
| Ruta pública (`POST /api/auth/login`) | Permite el paso sin token |
| Ruta protegida con Bearer válido | Extrae email del JWT y deja continuar la petición |
| JWT inválido | *(implícito en producción)* rechazo 401; en tests unitarios se valida el camino con token válido |

**Rutas públicas definidas en el filtro:** `/api/auth/register`, `/api/auth/login`.

**No cubierto en unitarios:** enrutamiento a puertos 8090/8091, CORS, ni integración end-to-end con microservicios.

---

## Resumen por capa

| Capa | Componentes bajo prueba | Enfoque |
|------|-------------------------|---------|
| Frontend | `algoritmo-puntuacion`, `gestor-alertas` | Lógica de negocio simulada (coincidencias y alertas) |
| Backend | `AuthService`, contexto Spring | Registro, login y arranque del servicio |
| Report service | `ReportService` | Creación con autor autenticado y consulta por id |
| Gateway | `AuthGatewayFilter` | Control de acceso JWT en el borde de la API |

---

## Relación con otras pruebas

Las verificaciones **Postman** (registro, login, 401 sin token, crear reporte con token) ejercitan el mismo contrato HTTP que consumen frontend y microservicios, pero a través del gateway en `localhost:9000`. El detalle de cada request Postman está en [PRUEBAS.md](PRUEBAS.md); aquí solo se listan los comportamientos de API que complementan lo anterior:

| Comportamiento de API (vía Gateway) | Qué valida respecto al sistema |
|---------------------------------------|--------------------------------|
| `POST /api/auth/register` | Alta de usuario y emisión de token |
| `POST /api/auth/login` | Autenticación y token reutilizable |
| `POST /api/reports` sin `Authorization` | Bloqueo en gateway (401), coherente con `AuthGatewayFilter` |
| `POST /api/reports` con Bearer | Creación de reporte autorizado de extremo a extremo |
