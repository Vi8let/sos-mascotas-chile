# SOS Mascotas - Report Service

Microservicio de reportes de SOS Mascotas Chile. En la version v1.7 este modulo queda separado del backend de autenticacion y se encarga de crear, listar, consultar, actualizar estado y eliminar reportes.

## Tecnologias

- Java 21
- Spring Boot 3.2.5
- Spring Web
- Spring Data JPA
- SQLite para desarrollo
- PostgreSQL previsto para produccion
- Lombok

## Responsabilidades

- `GET /api/reports`: lista reportes y permite filtros por tipo o busqueda.
- `GET /api/reports/{id}`: consulta un reporte por id.
- `POST /api/reports`: crea un reporte. Requiere header `Authorization: Bearer <token>`.
- `PUT /api/reports/{id}/estado`: actualiza el estado de un reporte.
- `DELETE /api/reports/{id}`: elimina un reporte.

El servicio corre en `http://localhost:8091`.

## Dependencia interna

Para validar el token recibido, este servicio consulta al microservicio de usuarios en:

```text
http://localhost:8090
```

Por eso se debe iniciar primero el backend de autenticacion antes de crear reportes.

## Como ejecutar

En una terminal, desde la carpeta `report-service`:

```powershell
.\mvnw.cmd spring-boot:run
```

Para ejecutar pruebas:

```powershell
.\mvnw.cmd test
```

La configuracion esta en `src/main/resources/application.properties`.
