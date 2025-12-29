<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Banco Full Stack - Proyecto Final</title>
</head>
<body>

  <h1>🏦 Banco Full Stack proyecto final 🏦</h1>

  <p>
    Proyecto Full Stack desarrollado como prueba práctica Backend / Frontend,
    que permite la gestión de Clientes y Cuentas Bancarias, cumpliendo con todos
    los requisitos solicitados.
  </p>

  <h2>📌 Tecnologías utilizadas</h2>

  <h3>Backend</h3>
  <ul>
    <li>NestJS (TypeScript)</li>
    <li>PostgreSQL</li>
    <li>TypeORM</li>
    <li>Swagger (documentación automática)</li>
  </ul>

  <h3>Frontend</h3>
  <ul>
    <li>React</li>
    <li>TypeScript</li>
    <li>Vite</li>
    <li>Axios</li>
    <li>React Router DOM</li>
  </ul>

  <h2>📁 Estructura del proyecto</h2>

  <pre>
bancof/
│
├── backend/     # API REST con NestJS
├── frontend/    # Aplicación web con React
└── README.md
  </pre>

  <h2>⚙️ Requisitos previos</h2>
  <ul>
    <li>Node.js v18 o superior</li>
    <li>PostgreSQL</li>
    <li>npm</li>
  </ul>

  <h2>🚀 Instalación y ejecución</h2>

  <h3>🔹 Backend</h3>
  <pre>
cd backend
npm install
npm run start:dev
  </pre>

  <p>El backend se ejecuta en:</p>
  <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>

  <h3>📘 Documentación API (Swagger)</h3>
  <p>Disponible en:</p>
  <a href="http://localhost:3000/api/docs" target="_blank">
    http://localhost:3000/api/docs
  </a>

  <h3>🔹 Frontend</h3>
  <pre>
cd frontend
npm install
npm run dev
  </pre>

  <p>El frontend se ejecuta en:</p>
  <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>

  <h2>🗄️ Configuración de la Base de Datos</h2>

  <p>Crear base de datos en PostgreSQL:</p>
  <pre>
CREATE DATABASE bancodb;
  </pre>

  <p>Configurar credenciales en el archivo <strong>.env</strong> del backend:</p>
  <pre>
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=bancodb
  </pre>

  <h3>Restaurar Base de Datos</h3>
  <ul>
    <li>El proyecto utiliza TypeORM</li>
    <li>Las tablas se generan automáticamente al iniciar el backend</li>
    <li>No es necesario archivo .sql</li>
  </ul>

  <h2>🧩 Entidades principales</h2>

  <h3>Cliente</h3>
  <ul>
    <li>id</li>
    <li>nombre</li>
    <li>paterno</li>
    <li>materno</li>
    <li>tipo_documento</li>
    <li>documento_identidad</li>
    <li>fecha_nacimiento</li>
    <li>genero</li>
    <li>fecha_creacion</li>
  </ul>

  <h3>Cuenta</h3>
  <ul>
    <li>id</li>
    <li>cliente_id</li>
    <li>tipo_producto</li>
    <li>numero_cuenta (único)</li>
    <li>moneda (BOB, USD)</li>
    <li>monto</li>
    <li>fecha_creacion</li>
    <li>sucursal</li>
  </ul>

  <h2>🔗 Endpoints implementados</h2>

  <h3>Clientes</h3>
  <ul>
    <li>POST /clientes — Crear cliente</li>
    <li>GET /clientes — Listar clientes</li>
    <li>GET /clientes/:id — Obtener cliente con cuentas</li>
    <li>PUT /clientes/:id — Actualizar cliente</li>
    <li>DELETE /clientes/:id — Eliminar cliente (soft delete)</li>
  </ul>

  <h3>Cuentas</h3>
  <ul>
    <li>POST /clientes/:id/cuentas — Crear cuenta</li>
    <li>GET /clientes/:id/cuentas — Listar cuentas del cliente</li>
    <li>GET /cuentas/:id — Obtener cuenta</li>
    <li>PUT /cuentas/:id — Actualizar cuenta</li>
    <li>DELETE /cuentas/:id — Eliminar cuenta</li>
  </ul>

  <h2>🖥️ Funcionalidades del Frontend</h2>

  <h3>Gestión de Clientes /clientes</h3>
  <ul>
    <li>Listar clientes</li>
    <li>Crear cliente</li>
    <li>Editar cliente</li>
    <li>Eliminar cliente</li>
    <li>Ver detalle del cliente con sus cuentas</li>
  </ul>

  <h3>Gestión de Cuentas /clientes/:id/cuentas</h3>
  <ul>
    <li>Listar cuentas del cliente</li>
    <li>Crear cuenta bancaria</li>
    <li>Editar cuenta</li>
    <li>Eliminar cuenta</li>
  </ul>

  <h2>📬 Instrucciones de Entrega</h2>

  <p><strong>📌 Repositorio público:</strong></p>
  <p>h</p>

  <p><strong>Fecha límite:</strong></p>
  <p>🗓️ 28 de diciembre de 2025 — 23:59</p>

  <p><strong>✉️ Correo de envío:</strong></p>
  <p>✉️ cesarnvf.academia.bo@gmail.com</p>

  <h2>👤 Contacto</h2>

  <div align="center">
    <a href="https://www.linkedin.com/in/marco" target="_blank">Marco</a> |
    <a href="https://www.linkedin.com/in/alain" target="_blank">Alain</a> |
    <a href="https://www.linkedin.com/in/boris" target="_blank">Boris</a>
  </div>

  <h3>Alain Boris Condori Flores</h3>
  <h3>Jhon Boris Rivera Caceres</h3>
  <h3>Marcos Luis Herrera Beltran</h3>
		<h3> Luis Ventura Sanchez</h3>
<h3> Cimar lopez</h3>
<h3>Leonardo antonio tellez</h3>

  <p><strong>Correo:</strong> cesarnvf.academia.bo@gmail.com</p>

  <h2>✅ Estado del proyecto</h2>
  <ul>
    <li>✔️ Backend completo</li>
    <li>✔️ Frontend completo</li>
    <li>✔️ Swagger funcional</li>
    <li>✔️ PostgreSQL integrado</li>
    <li>✔️ CRUD Clientes y Cuentas</li>
    <li>✔️ Repositorio público</li>
  </ul>

</body>
</html>
