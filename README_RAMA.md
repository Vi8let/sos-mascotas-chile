# Documentación de la Rama `Guerben-dev`

Esta rama contiene la transición de la aplicación monolítica a una arquitectura basada en microservicios, así como la adición de nuevas funcionalidades. A continuación se detalla todo lo que se ha implementado y cómo funciona.

## 🚀 Cambios Principales

### 1. Creación del API Gateway
Se ha creado un nuevo módulo **Gateway** (`/gateway`) utilizando **Spring Cloud Gateway** y **Spring WebFlux**.
- **Propósito**: Actuar como punto de entrada único para todas las peticiones del frontend, enrutando las solicitudes a los microservicios correspondientes.
- **Seguridad Centralizada**: Se implementó un filtro de autenticación (`AuthGatewayFilter`) que intercepta las peticiones.
  - Las rutas públicas (`/api/auth/register`, `/api/auth/login`) pasan directamente.
  - Para las demás rutas, el Gateway verifica el token JWT utilizando la clave secreta. Si es válido, extrae la información y permite el paso; si no, rechaza la petición con estado `401 Unauthorized`.
- **Tecnologías**: Java 21, Spring Boot 3.5.14, JJWT 0.12.6.

### 2. Modificaciones en el Backend (Microservicio)
El backend existente se ha adaptado para funcionar dentro de este nuevo ecosistema:
- **Puerto cambiado**: El servidor ahora corre en el puerto `8090` en lugar de `8081`.
- **Base de Datos**: Se cambió la ruta de la base de datos SQLite a `db/sos_mascotas.db` para mantener el directorio raíz más limpio.
- **DTOs actualizados**: Se modificó `UserInfoResponse` para que el campo `role` sea devuelto como `String` en lugar del Enum, facilitando la serialización y la compatibilidad entre servicios.
- **Comunicación entre servicios**: Se agregó un bean de `RestTemplate` y la clase `UserServiceClient` para permitir que el backend valide tokens consultando a un servicio de usuarios externo (configurado en `http://localhost:9000`).

### 3. Nuevo Módulo de Reportes (Reports API)
Se implementó toda la lógica para la gestión de reportes de mascotas en el backend:
- **Modelos**: `Report`, `EstadoReporte` (Enum), `TipoReporte` (Enum).
- **Repositorio**: `ReportRepository` extendiendo JpaRepository.
- **Servicios y Controladores**: `ReportService` y `ReportController` para manejar el CRUD y la lógica de negocio de los reportes.
- **DTOs**: `CreateReportRequest`, `ReportResponse`.

## 🛠️ Correcciones Realizadas (Bugfixes)
- Se actualizó el código del Gateway (`JwtUtil.java`) para que sea compatible con la última versión de **JJWT (0.12.6)**, reemplazando métodos obsoletos (`parserBuilder()`, `setSigningKey()`) por la nueva API (`parser()`, `verifyWith()`).
- Se corrigió la inyección de dependencias en `AuthGatewayFilter` agregando un constructor explícito para evitar problemas de compilación derivados de la ausencia de configuración de Lombok en el `maven-compiler-plugin` del Gateway.
- Se igualaron las versiones de Spring Boot (`3.5.14`) entre el backend y el gateway para asegurar compatibilidad total y resolver errores de resolución de Maven.

## ⚙️ ¿Cómo funciona ahora?
1. El **Frontend** envía todas sus peticiones al **API Gateway** (típicamente en el puerto 8080 o el puerto configurado).
2. El **Gateway** evalúa la ruta:
   - Si es `/api/auth/...`, la deja pasar hacia el servicio correspondiente.
   - Si es otra ruta (ej. `/api/reports/...`), el Gateway lee el header `Authorization`, valida el token JWT criptográficamente y, si todo está correcto, enruta la solicitud al **Backend** (puerto 8090).
3. El **Backend** procesa la solicitud (por ejemplo, guardar un nuevo reporte en la base de datos SQLite) y devuelve la respuesta al Gateway, que finalmente se la entrega al cliente.

## 🖥️ Cómo compilar y ejecutar
Para compilar ambos proyectos de forma independiente, en la raíz de cada carpeta (`/backend` y `/gateway`) puedes ejecutar:
```bash
./mvnw clean package -DskipTests
```
*(Nota: Ambos proyectos compilan ahora correctamente tras las correcciones aplicadas).*
