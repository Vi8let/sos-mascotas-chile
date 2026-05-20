# SOS Mascotas - Backend Auth/Users

Microservicio de usuarios y autenticacion de SOS Mascotas Chile. En la version v1.7 este modulo queda separado del servicio de reportes: expone usuarios, registro, login, validacion de JWT y datos del usuario autenticado.

## Tecnologias

- Java 21
- Spring Boot 3.2.5
- Spring Web
- Spring Security
- Spring Data JPA
- SQLite para desarrollo
- PostgreSQL previsto para produccion
- JJWT 0.12.6
- Lombok

## Responsabilidades

- `POST /api/auth/register`: registra usuarios.
- `POST /api/auth/login`: autentica usuarios y emite JWT.
- `GET /api/auth/validate`: valida un token y devuelve informacion del usuario.
- `GET /api/auth/me`: devuelve el usuario autenticado.

El servicio corre en `http://localhost:8090`.

## Cuenta de prueba

Al iniciar el backend se crea automaticamente esta cuenta, porque la base SQLite se recrea en cada arranque durante desarrollo:

```text
Email: test@gmail.com
Password: Duoc1234
```

## Como ejecutar

En una terminal, desde la carpeta `backend`:

```powershell
.\mvnw.cmd spring-boot:run
```

Para ejecutar pruebas:

```powershell
.\mvnw.cmd test
```

La configuracion esta en `src/main/resources/application.properties`.
