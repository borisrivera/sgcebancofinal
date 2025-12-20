<!-- header Animation -->
<div align= "center"> 
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=240&text=zMarco_hub%20GitHub&animation=fadeIn&fontColor=2a2828&fontSize=50" />
</div>

# Sistema de Gestión de Cursos y Estudiantes

<div align="center">

  <p align="center">
    <img src="https://media.giphy.com/media/WUlplcMpOCEmTGBtBW/giphy.gif" width="150">
  </p>

  <img src="https://readme-typing-svg.herokuapp.com?color=%236FDA44&size=30&center=true&vCenter=true&width=672&height=55&lines=Hola+somos+el+grupo+3+del+Diplomado;Full-Stack+Developer;Sistema+de+Gestion+de+Cursos+y+Estudiantes;" alt="Headline" />

<br><br>

  </div>

Este proyecto es un **Sistema de Gestión de Cursos y Estudiantes** implementado con un **backend** usando **NestJS**, **PostgreSQL** como base de datos, y **TypeORM** como ORM. El **frontend** está desarrollado con **Angular 21** y **TailwindCSS 4**. El sistema permite la gestión de cursos, estudiantes, inscripciones, y evaluaciones de manera eficiente.

# 🚀 Características del Proyecto

## Backend (NestJS)

- ✅ **Arquitectura modular y escalable**
- ✅ **API RESTful** con TypeScript
- ✅ **Autenticación JWT** con roles
- ✅ **Persistencia** con PostgreSQL y TypeORM
- ✅ **Documentación automática** con Swagger
- ✅ **Validación de datos** con `class-validator`
- ✅ **Manejo de errores global** en toda la aplicación
- ✅ **Seeds** para datos iniciales

## Frontend (Angular 21)

- ✅ **Aplicación SPA** con Angular
- ✅ **Gestión de estado** con Signals
- ✅ **Control Flow** con `@if` y `@for`
- ✅ **Diseño responsive** con Tailwind CSS 4
- ✅ **Tema oscuro** con acentos verdes
- ✅ **Autenticación y autorización**
- ✅ **CRUD completo** para todas las entidades

## Base de Datos (PostgreSQL)

- ✅ **Modelo relacional completo**
- ✅ **Migraciones** con TypeORM
- ✅ **Relaciones 1:1, 1:N y N:M**
- ✅ **Índices optimizados** para mejorar el rendimiento
- ✅ **Validación a nivel de base de datos** para integridad de datos

## Tecnologías

### Backend

| ![NestJS](https://raw.githubusercontent.com/tandpfun/skill-icons/master/icons/NestJS-Dark.svg) | ![PostgreSQL](https://raw.githubusercontent.com/tandpfun/skill-icons/master/icons/PostgreSQL-Dark.svg) | ![TypeORM](https://raw.githubusercontent.com/tandpfun/skill-icons/master/icons/TypeORM-Dark.svg) |
| :--------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
|                                 [NestJS](https://nestjs.com/)                                  |                               [PostgreSQL](https://www.postgresql.org/)                                |                                  [TypeORM](https://typeorm.io/)                                  |

### Frontend

| ![Angular](https://raw.githubusercontent.com/tandpfun/skill-icons/master/icons/Angular-Dark.svg) | ![Tailwind](https://raw.githubusercontent.com/tandpfun/skill-icons/59059d9d1a2c092696dc66e00931cc1181a4ce1f/icons/TailwindCSS-Dark.svg) |
| :----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
|                                [Angular 21](https://angular.io/)                                 |                                                 [TailwindCSS](https://tailwindcss.com/)                                                 |

## Requisitos

Antes de comenzar, asegúrate de tener las siguientes herramientas instaladas en tu sistema:

- **Node.js** (v22.x o superior) – [Instalar Node.js](https://nodejs.org/)
- **npm** (v10.x o superior) – [Instalar npm](https://www.npmjs.com/get-npm)
- **PostgreSQL** – [Instalar PostgreSQL](https://www.postgresql.org/download/)

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de carpetas:

```bash
├── backend/ # Backend implementado con NestJS
├── frontend/ # Frontend implementado con Angular
├── .env # Variables de entorno para el Backend
├── README.md # Este archivo
└── docker-compose.yml # Configuración para ejecutar el proyecto en contenedores Docker (opcional)
```

## Backend

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/zMarco-hub/sgce
cd sgce
```

### 2. Configuración del Backend

    Navega a la carpeta `backend/`:

```bash
 ## Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

```

### 2. Configuración

Asegúrate de tener configuradas las variables de entorno para la conexión a la base de datos PostgreSQL. Crea un archivo .env en la carpeta backend/ y agrega las siguientes variables:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nombre_de_tu_base_de_datos
DATABASE_USER=usuario
DATABASE_PASSWORD=contraseña
```

### 3.Ejecución

Inicia la aplicación en modo de desarrollo:

```bash
npm run start:dev
```

### Frontend

### 1. Instalación

Navega a la carpeta frontend/:

```bash
cd frontend
```

Instala las dependencias del proyecto:

```bash
npm install
```

### 2. Ejecución

Inicia la aplicación en modo de desarrollo:

```bash
npm start
# o
ng serve
```

El frontend estará disponible en

http://localhost:4200

# 🗄️ Configuración de la Base de Datos

```bash
-- Conectarse a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE sgce_db;
```

## 📚 Documentación API

Una vez que el backend esté ejecutándose, la documentación Swagger estará disponible en:

http://localhost:3000/api/docs

## Endpoints Principales

### Autenticación

```bash
POST   /api/auth/login          - Iniciar sesión

```

### Usuarios

```bash
GET /api/v1/usuarios - Listar usuarios (ADMIN)
GET /api/v1/usuarios/:id - Obtener usuario por ID
POST /api/v1/usuarios - Crear usuario (ADMIN)
PATCH /api/v1/usuarios/:id - Actualizar usuario (ADMIN)
DELETE /api/v1/usuarios/:id - Eliminar usuario (ADMIN)
```

### Estudiantes

```bash
GET    /api/v1/estudiante       - Listar estudiantes
GET    /api/v1/estudiante/:id   - Obtener estudiante por ID
POST   /api/v1/estudiante       - Crear estudiante
PATCH  /api/v1/estudiante/:id   - Actualizar estudiante
DELETE /api/v1/estudiante/:id   - Eliminar estudiante

```

### Docentes

```bash
GET    /api/v1/docente          - Listar docentes
GET    /api/v1/docente/:id      - Obtener docente por ID
POST   /api/v1/docente          - Crear docente
PATCH  /api/v1/docente/:id      - Actualizar docente
DELETE /api/v1/docente/:id      - Eliminar docente
```

### Cursos

```bash
GET    /api/v1/cursos            - Listar cursos
GET    /api/v1/cursos/:id        - Obtener curso por ID
POST   /api/v1/cursos            - Crear curso
PATCH  /api/v1/cursos/:id        - Actualizar curso
DELETE /api/v1/cursos/:id        - Eliminar curso
```

### Evaluaciones

```bash
GET    /api/v1/evaluaciones       - Listar evaluaciones
GET    /api/v1/evaluaciones/:id   - Obtener evaluación por ID
POST   /api/v1/evaluaciones       - Crear evaluación
PATCH  /api/v1/evaluaciones/:id   - Actualizar evaluación
DELETE /api/v1/evaluaciones/:id   - Eliminar evaluación
```

### Inscripciones

```bash
GET    /api/v1/inscripciones      - Listar inscripciones
GET    /api/v1/inscripciones/:id  - Obtener inscripción por ID
POST   /api/v1/inscripciones      - Crear inscripción
PATCH  /api/v1/inscripciones/:id  - Actualizar inscripción
DELETE /api/v1/inscripciones/:id  - Eliminar inscripción
```

### Notas

```bash
GET    /api/v1/notas             - Listar notas
GET    /api/v1/notas/:id         - Obtener nota por ID
POST   /api/v1/notas             - Crear nota
PATCH  /api/v1/notas/:id         - Actualizar nota
DELETE /api/v1/notas/:id         - Eliminar nota
```

## 🔒 Seguridad

Mejores Prácticas Implementadas

✅ **Validación de entrada en backend y frontend**

✅ **Autenticación JWT con expiración**

✅ **CORS configurado**

✅ **Protección contra inyección SQL**

✅ **Rate limiting (configurable)**

✅ **Headers de seguridad HTTP**

✅ **Variables de entorno para datos sensibles**

✅ **Hash de contraseñas con bcrypt**

## 🙏 Agradecimientos

✅ **NestJS**

✅ **Angular**

✅ **TypeORM**

✅ **Tailwind CSS**

✅ **Swagger**

## 👨‍💻 Author

<div align="center">

[![Marco](https://img.shields.io/badge/Marco-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marco)
[![Alain](https://img.shields.io/badge/Alain-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alain)
[![Boris](https://img.shields.io/badge/Boris-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/boris)
[![Leonardo](https://img.shields.io/badge/Leonardo-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/leonardo)
[![Omar](https://img.shields.io/badge/Omar-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/omar)
[![Luis](https://img.shields.io/badge/Luis-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luis)

</div>

<!-- Footer Animation -->
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=9370DB&height=100&section=footer" width="100%"/>
</div>
