# SOS Mascotas - Backend Service

Este es el **Microservicio Backend Principal** del ecosistema de SOS Mascotas Chile. Gestiona la lógica de negocio central, incluyendo el manejo de usuarios, autenticación, y reportes de mascotas perdidas o encontradas.

## 📌 Descripción del Proyecto
Este módulo es el corazón de la aplicación. Originalmente una aplicación monolítica, ha sido refactorizado para interactuar dentro de una arquitectura de microservicios (junto con el API Gateway). Expone una API RESTful para realizar operaciones CRUD y manejar la persistencia de datos relacionados a mascotas e interactuar con la base de datos.

## 🛠️ Tecnologías y Herramientas Utilizadas
El proyecto está desarrollado con una pila tecnológica estándar y muy robusta del ecosistema Java:

- **Java 26**: Lenguaje de programación.
- **Spring Boot (3.5.x)**: Framework principal que facilita la creación de aplicaciones stand-alone.
- **Spring Web**: Para la construcción de la API RESTful (controladores, serialización JSON).
- **Spring Security**: Para manejar la autorización a nivel de aplicación (Roles de usuario).
- **Spring Data JPA & Hibernate**: Implementación de ORM para el mapeo objeto-relacional e interacción con la base de datos.
- **SQLite (Desarrollo) / PostgreSQL (Producción)**: Bases de datos relacionales utilizadas según el entorno.
- **JJWT (0.12.6)**: Para la generación y emisión de JSON Web Tokens durante el login y registro.
- **Lombok**: Librería que reduce la escritura de código repetitivo (getters, setters, constructores).

## 🧩 Componentes Principales
- **Sistema de Autenticación (`/api/auth`)**: Permite a los usuarios registrarse e iniciar sesión de manera segura. Al tener éxito, emite un token JWT con la información de los roles del usuario.
- **Módulo de Reportes (`/api/reports`)**: Permite la creación, lectura y actualización de reportes de mascotas (extraviadas, encontradas, avistadas). Utiliza `Spring Data JPA` para persistir los datos de los reportes.
- **Comunicación Interna (`UserServiceClient`)**: Permite que el backend realice solicitudes HTTP hacia otros microservicios (por ejemplo, validando tokens de forma cruzada) utilizando `RestTemplate`.

## ⚙️ Configuración y Ejecución
La configuración de este servicio (puerto, conexión a base de datos, URLs de otros servicios) se encuentra en el archivo `src/main/resources/application.properties`. Por defecto, este servicio corre en el puerto `8090`.

### Requisitos previos
- JDK configurado.
- (Opcional) Si se usa en producción, una instancia de PostgreSQL en ejecución. Para desarrollo, se usará SQLite generando automáticamente el archivo local `db/sos_mascotas.db`.

### Comandos de ejecución
Para compilar el proyecto:
```bash
# En Windows
.\mvnw.cmd clean package -DskipTests

# En Linux / macOS
./mvnw clean package -DskipTests
```

Para correr la aplicación de forma local:
```bash
# En Windows
.\mvnw.cmd spring-boot:run
```
