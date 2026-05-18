# SOS Mascotas - API Gateway

Este es el servicio de **API Gateway** del ecosistema de microservicios de SOS Mascotas Chile. 

## 📌 Descripción del Proyecto
El API Gateway actúa como el punto de entrada único para todas las solicitudes provenientes de los clientes (como la aplicación frontend). Su responsabilidad principal es recibir las peticiones web, enrutarlas hacia los microservicios correspondientes (como el Backend/Servicio de Usuarios o el Servicio de Reportes) y aplicar filtros transversales, tales como la validación de seguridad centralizada.

## 🛠️ Tecnologías y Herramientas Utilizadas
Este proyecto está construido con herramientas modernas enfocadas en la programación reactiva y un alto rendimiento:

- **Java 21**: Lenguaje de programación base.
- **Spring Boot (3.5.x)**: Framework principal para simplificar la configuración y el desarrollo.
- **Spring Cloud Gateway**: Proporciona un enrutamiento de API sencillo y efectivo sobre Spring WebFlux.
- **Spring WebFlux**: Framework reactivo no bloqueante usado para manejar un gran número de conexiones concurrentes de manera eficiente.
- **JJWT (0.12.6)**: Librería utilizada para procesar y validar tokens JWT (JSON Web Tokens) criptográficamente de forma segura.

## 🔐 Seguridad y Flujo de Peticiones
1. **Rutas Públicas**: Las peticiones dirigidas a la autenticación (ej. `/api/auth/register`, `/api/auth/login`) están configuradas para pasar directamente hacia el servicio correspondiente sin restricciones.
2. **Rutas Protegidas**: Para cualquier otra ruta, el Gateway ejecuta un filtro de seguridad (`AuthGatewayFilter`).
3. **Validación JWT**: El Gateway lee el header `Authorization`, extrae el token JWT y lo verifica utilizando una clave secreta simétrica. Si el token es manipulado o expira, el Gateway bloquea la petición retornando un error `401 Unauthorized` sin llegar a cargar los microservicios internos.

## 🚀 Cómo compilar y ejecutar localmente

Asegúrate de tener instalado el JDK adecuado. Para compilar y empaquetar el servicio, ejecuta el siguiente comando en la raíz de este directorio:

```bash
# En Windows
..\backend\mvnw.cmd clean package -DskipTests

# En Linux / macOS (si tienes el wrapper instalado)
./mvnw clean package -DskipTests
```

Para iniciar el servidor localmente:
```bash
# En Windows
..\backend\mvnw.cmd spring-boot:run
```

El Gateway generalmente se despliega de manera independiente y enruta el tráfico interno a los puertos donde estén alojados el resto de microservicios.
