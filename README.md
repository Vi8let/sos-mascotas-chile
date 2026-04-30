# SOS Mascotas Chile

Plataforma comunitaria para ayudar a reencontrar mascotas perdidas con sus familias.

## Tecnologías utilizadas

Este proyecto está construido con:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Instalación y Uso Local

```sh
# Instalar dependencias
npm install

# Iniciar el servidor local
npm run dev
```
# TO DO

# Definición de Ramas y Tareas – Proyecto Fullstack (Sanos y Salvos)

## 🌿 feature/frontend-ui
**Responsabilidad:** Capa de presentación (React + Vite + Tailwind)

### Vistas principales
- Home (listado de mascotas perdidas/encontradas)
- Página de detalle de reporte
- Formulario crear/editar reporte
- Login / registro
- Perfil de usuario
- Vista de coincidencias sugeridas

### Componentes UI
- Card de mascota (imagen + datos)
- Navbar / sidebar
- Formularios reutilizables
- Modales (confirmaciones, contacto)
- Sistema de notificaciones (toasts)

### Estado y lógica frontend
- Manejo de estado (Context / Redux)
- Manejo de sesión (JWT)
- Protección de rutas

### Integración con backend
- Cliente API (fetch/axios)
- Consumo de endpoints:
  - `/usuarios`
  - `/reportes`
  - `/coincidencias`
  - `/notificaciones`

### UX/UI
- Diseño responsive
- Estados de carga y error
- Feedback visual al usuario

---

## ⚙️ feature/backend-usuarios
**Responsabilidad:** Microservicio de usuarios y autenticación

### Modelo y persistencia
- Entidad `Usuario`
- Roles (dueño, veterinaria, rescatista, admin)
- Base de datos propia

### Endpoints
- `POST /usuarios/registro`
- `POST /usuarios/login`
- `GET /usuarios/perfil`
- `PUT /usuarios/perfil`

### Seguridad
- Generación de JWT
- Hash de contraseñas (bcrypt)
- Middleware de autorización

### Integración
- Validación de tokens en API Gateway

### Extras
- Recuperación de contraseña (opcional)
- Validaciones de datos

---

## 📊 feature/backend-reportes
**Responsabilidad:** Microservicio principal del negocio

### Modelo de dominio
- Aggregate Root: `ReporteMascota`
- Atributos:
  - especie, raza, color
  - ubicación
  - estado (PERDIDO, AVISTADO, ENCONTRADO)
  - imágenes
  - usuario dueño

### Persistencia
- Base de datos propia
- Repository Pattern (`ReporteRepository`)

### Endpoints
- `POST /reportes`
- `GET /reportes`
- `GET /reportes/{id}`
- `PUT /reportes/{id}`
- `DELETE /reportes/{id}`

### Lógica de negocio
- Cambio de estado
- Validaciones
- Asociación con usuario

### Eventos de dominio
- `ReporteCreadoEvent`
- `ReporteActualizadoEvent`
- `MascotaEncontradaEvent`

---

## 🧠 feature/motor-coincidencias
**Responsabilidad:** Microservicio de matching (asíncrono)

### Consumo de eventos
- Eventos de reportes (creación/actualización)

### Lógica de matching
- Comparación por:
  - especie
  - raza
  - color
  - ubicación
  - fecha

### Algoritmo
- Sistema de scoring
- Filtrado de coincidencias

### Output
- Generación de coincidencias
- Evento: `CoincidenciaDetectadaEvent`

### Consideraciones
- Procesamiento asíncrono
- Stateless

---

## 🔔 feature/notificaciones
**Responsabilidad:** Microservicio de notificaciones

### Consumo de eventos
- `CoincidenciaDetectadaEvent`
- Otros eventos del sistema

### Tipos de notificación
- Notificación en app
- Email (opcional)
- Push (opcional)

### Lógica
- Determinar destinatarios
- Formatear mensajes

### Endpoints
- `GET /notificaciones`
- `POST /notificaciones` (opcional)

### Integraciones
- Servicios externos (correo, Firebase, etc.)

---

## 🔗 Flujo general del sistema
- `backend-reportes` → emite eventos  
- `motor-coincidencias` → procesa coincidencias  
- `notificaciones` → informa a usuarios  
- `frontend` → muestra información  
- `backend-usuarios` → gestiona autenticación  

---
