# Guía de pruebas — SOS Mascotas Chile

Documentación de las pruebas automatizadas (unitarias) y manuales/API (Postman) del proyecto.

Para ver **solo qué elementos y comportamientos** cubre cada test (sin comandos ni setup), consulta **[ELEMENTOS-PROBADOS.md](ELEMENTOS-PROBADOS.md)**.

## Resumen

| Capa | Herramienta | Ubicación | Comando |
|------|-------------|-----------|---------|
| Backend (auth) | JUnit 5, Mockito, AssertJ | `backend/src/test/java/` | `cd backend && .\mvnw.cmd test` |
| Report service | JUnit 5, Mockito, AssertJ | `report-service/src/test/java/` | `cd report-service && .\mvnw.cmd test` |
| Gateway (BFF) | JUnit 5, Mockito, Spring WebFlux mocks | `gateway/src/test/java/` | `cd gateway && ..\backend\mvnw.cmd test` |
| Frontend | Vitest, jsdom, Testing Library | `frontend/src/**/*.test.ts` | `cd frontend && npm test` |
| API integración | Postman | Raíz del repo (`*.json`) | Ver sección Postman |

---

## 1. Pruebas unitarias — Backend (`backend/`)

### Archivos

| Archivo | Qué verifica |
|---------|----------------|
| `BackendApplicationTests.java` | El contexto Spring Boot arranca sin errores |
| `AuthServiceTest.java` | Registro crea usuario con contraseña codificada y rol `USER` |
| `AuthServiceTest.java` | Login autentica y devuelve JWT con email y rol |

### Ejecutar

```powershell
cd backend
.\mvnw.cmd test
```

**Resultado esperado:** 3 tests OK (contexto + registro + login).

---

## 2. Pruebas unitarias — Report service (`report-service/`)

### Archivos

| Archivo | Qué verifica |
|---------|----------------|
| `ReportServiceTest.java` | `create` asigna el `autorId` del usuario validado por token |
| `ReportServiceTest.java` | `getById` lanza excepción si el reporte no existe |

### Ejecutar

```powershell
cd report-service
.\mvnw.cmd test
```

**Resultado esperado:** 2 tests OK.

---

## 3. Pruebas unitarias — Gateway (`gateway/`)

El gateway exige `Authorization: Bearer <token>` en todas las rutas excepto registro y login.

### Archivos

| Archivo | Qué verifica |
|---------|----------------|
| `AuthGatewayFilterTest.java` | `GET /api/reports` sin token → **401** |
| `AuthGatewayFilterTest.java` | `POST /api/reports` sin token → **401** |
| `AuthGatewayFilterTest.java` | `POST /api/auth/login` sin token → permite paso |
| `AuthGatewayFilterTest.java` | Ruta protegida con Bearer válido → permite paso |

### Ejecutar

```powershell
cd gateway
..\backend\mvnw.cmd test
```

**Resultado esperado:** 4 tests OK.

---

## 4. Pruebas unitarias — Frontend (`frontend/`)

Módulos simulados del dominio (motor de coincidencias y notificaciones).

### Archivos

| Archivo | Qué verifica |
|---------|----------------|
| `src/motor-coincidencias/algoritmo-puntuacion.test.ts` | Strategy Pattern: especie, raza, color, ubicación, fecha y puntaje total |
| `src/servicio-notificaciones/gestor-alertas.test.ts` | Prioridad ALTA/MEDIA, marcar leída, listado por usuario |
| `src/test/example.test.ts` | Smoke de Vitest |

### Ejecutar

```powershell
cd frontend
npm install
npm test
```

Modo watch (desarrollo):

```powershell
npm run test:watch
```

**Resultado esperado:** 12 tests OK.

---

## 5. Suite completa (una sola pasada)

```powershell
cd backend
.\mvnw.cmd test

cd ..\report-service
.\mvnw.cmd test

cd ..\gateway
..\backend\mvnw.cmd test

cd ..\frontend
npm test
```

---

## 6. Pruebas Postman (API vía Gateway)

### Archivos en la raíz del repositorio

| Archivo | Uso |
|---------|-----|
| `sos_mascotas_chile_postman_collection.json` | Colección con requests y tests automáticos |
| `sos_mascotas_chile_postman_environment.json` | Variables: `base_url`, `test_email`, `test_password`, `token`, `report_id` |

### Importar en Postman

1. **Import** → seleccionar ambos JSON.
2. Activar el environment **「SOS Mascotas - Local (Gateway)」**.
3. Levantar los servicios antes de probar:

```powershell
# Terminal 1
cd backend
.\mvnw.cmd spring-boot:run

# Terminal 2
cd report-service
.\mvnw.cmd spring-boot:run

# Terminal 3
cd gateway
..\backend\mvnw.cmd spring-boot:run
```

El gateway debe estar en `http://localhost:9000` (`base_url` por defecto).

### Carpeta «Flujo de verificación (rubrica)»

Ejecutar **en orden** (Collection Runner o manual):

| # | Request | Verificación (Tests tab) |
|---|---------|----------------------------|
| 1 | **Register** | `201`, body con `token`, `email`, `role: USER`; guarda `test_email` y `token` |
| 2 | **Login** | `200`, nuevo JWT; actualiza `token` |
| 7 | **Create Report - 401 sin token** | `401` sin header `Authorization` |
| 8 | **Create Report - con token** | `201`, `titulo` correcto, `autorNombre` presente; guarda `report_id` |

### Detalle de cada prueba Postman

#### Register / Login

- Body alineado con el backend: `email`, `password`, `nombre`, `telefono` (registro) y `email`, `password` (login).
- El email de prueba se genera en pre-request: `postman_<timestamp>@test.cl` para evitar conflicto por email duplicado.
- Contraseña por defecto en environment: `Password123!`.

#### 401 sin token (ítem 7)

- `POST {{base_url}}/api/reports` **sin** header `Authorization`.
- El **gateway** responde `401` antes de llegar al microservicio de reportes.
- Equivale a la prueba unitaria `rejectsPostCreateReportWithoutBearerToken` en `AuthGatewayFilterTest`.

#### Crear reporte con token (ítem 8)

- `POST {{base_url}}/api/reports` con `Authorization: Bearer {{token}}`.
- Body según `CreateReportRequest`:

```json
{
  "titulo": "Perrito perdido en plaza",
  "tipo": "ANIMAL_PERDIDO",
  "descripcion": "...",
  "ubicacion": "Plaza de Armas, Santiago",
  "imagenUrl": "https://ejemplo.com/foto.jpg",
  "contacto": "+56912345678"
}
```

- Respuesta esperada: **201** con `id`, `titulo`, `tipo`, `autorNombre`, etc.

### Collection Runner

1. Clic derecho en la carpeta **「Flujo de verificación (rubrica)」** → **Run folder**.
2. Revisar que todos los tests en verde.
3. Si falla el ítem 8, confirmar que 1 y 2 se ejecutaron antes (token en environment).

### Rutas públicas vs protegidas (Gateway)

| Ruta | Sin token | Con Bearer válido |
|------|-----------|-------------------|
| `POST /api/auth/register` | OK | OK |
| `POST /api/auth/login` | OK | OK |
| `POST /api/reports` | **401** | OK (si backend/report-service activos) |
| `GET /api/reports` | **401** | OK |
| `GET /api/auth/validate` | **401** | OK |

---

## 7. Matriz rubrica ↔ implementación

| Requisito | Unitario | Postman |
|-----------|----------|---------|
| Tests backend | `AuthServiceTest`, `BackendApplicationTests` | — |
| Tests report-service | `ReportServiceTest` | — |
| Tests gateway | `AuthGatewayFilterTest` | — |
| Tests frontend | Vitest (`algoritmo-puntuacion`, `gestor-alertas`) | — |
| Login o registro | `AuthServiceTest` | Ítems 1 y 2 |
| `401` sin token | `rejectsPostCreateReportWithoutBearerToken` | Ítem 7 |
| Crear reporte con token | `ReportServiceTest.createAssigns...` | Ítem 8 |

---

## 8. Solución de problemas

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| Maven `TypeTag :: UNKNOWN` o Mockito/Java 26 | JDK demasiado nuevo para Lombok/Mockito del proyecto | Usar **JDK 17 o 21** (`java -version`) |
| `vitest` no reconocido | Sin `node_modules` | `cd frontend && npm install && npm test` |
| Postman `ECONNREFUSED` | Gateway no levantado | `spring-boot:run` en `gateway/` |
| Register `409` / email duplicado | Email fijo reutilizado | Usar flujo con pre-request (email dinámico) |
| Create report `401` en ítem 8 | Token vacío o expirado | Re-ejecutar Register + Login |
| Create report `502` / timeout | `report-service` o `backend` caídos | Levantar ambos microservicios |
| Frontend tests fallan | Dependencias | `cd frontend && npm install && npm test` |
| Maven no encuentra `mvnw` en gateway | Wrapper compartido | Usar `..\backend\mvnw.cmd test` desde `gateway/` |

---

## 9. Referencias

- Configuración Vitest: `frontend/vitest.config.ts`
- Setup frontend: `frontend/src/test/setup.ts`
- Filtro gateway: `gateway/src/main/java/sos_mascotas/gateway/filter/AuthGatewayFilter.java`
- Controlador reportes: `report-service/.../ReportController.java`
