import { Routes, Route, Navigate } from 'react-router-dom';

import ClientesPage from './pages/ClientesPage';
import ClienteDetallePage from './pages/ClienteDetallePage';
import CuentasPage from './pages/CuentasPage';
import MovimientosPage from './pages/MovimientosPage';

export default function App() {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/clientes" replace />} />

      {/* Clientes */}
      <Route path="/clientes" element={<ClientesPage />} />

      {/* ✅ DETALLE DE CLIENTE (esto arregla 404) */}
      <Route path="/clientes/:clienteId" element={<ClienteDetallePage />} />

      {/* Cuentas por cliente */}
      <Route path="/clientes/:clienteId/cuentas" element={<CuentasPage />} />

      {/* Movimientos por cuenta */}
      <Route
        path="/clientes/:clienteId/cuentas/:cuentaId/movimientos"
        element={<MovimientosPage />}
      />

      {/* Fallback */}
      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
    </Routes>
  );
}
