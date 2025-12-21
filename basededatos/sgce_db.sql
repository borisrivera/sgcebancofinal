CREATE TYPE rol_nombre AS ENUM ('ADMIN', 'DOCENTE', 'ESTUDIANTE');

CREATE TABLE rol (
  id SERIAL PRIMARY KEY,
  nombre rol_nombre UNIQUE NOT NULL
);

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  rol_id INT NOT NULL REFERENCES rol(id) ON UPDATE CASCADE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE estudiante (
  id SERIAL PRIMARY KEY,
  usuario_id INT UNIQUE NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  codigo VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE docente (
  id SERIAL PRIMARY KEY,
  usuario_id INT UNIQUE NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  titulo VARCHAR(120)
);

CREATE TABLE curso (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  docente_id INT NOT NULL REFERENCES docente(id) ON DELETE RESTRICT,
  gestion VARCHAR(20) NOT NULL, -- p.ej. "2025-1"
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (nombre, gestion, docente_id)
);

CREATE TABLE inscripcion (
  id SERIAL PRIMARY KEY,
  estudiante_id INT NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
  curso_id INT NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (estudiante_id, curso_id)
);

CREATE TABLE evaluacion (
  id SERIAL PRIMARY KEY,
  curso_id INT NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
  titulo VARCHAR(120) NOT NULL,
  tipo VARCHAR(40) NOT NULL, -- EXAMEN, TAREA, PROYECTO
  fecha DATE NOT NULL,
  ponderacion NUMERIC(5,2) NOT NULL CHECK (ponderacion > 0 AND ponderacion <= 100)
);

CREATE TABLE notas (
  id SERIAL PRIMARY KEY,
  evaluacion_id INT NOT NULL REFERENCES evaluacion(id) ON DELETE CASCADE,
  estudiante_id INT NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
  nota NUMERIC(5,2) NOT NULL CHECK (nota >= 0 AND nota <= 100),
  feedback TEXT,
  UNIQUE (evaluacion_id, estudiante_id)
);
