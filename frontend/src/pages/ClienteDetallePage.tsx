import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

type ApiErrorResponse = { message?: string | string[] };

function getErrorMessage(e: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorResponse>(e)) {
    const msg = e.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    return msg ?? e.message ?? fallback;
  }
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

type Cuenta = {
  id: number;
  numero_cuenta: string;
  tipo_producto: string;
  moneda: string;
  monto: number;
  sucursal: string;
  cliente_id: number;
};

type ClienteDetalle = {
  id: number;
  nombre: string;
  paterno: string;
  materno: string;
  tipo_documento: string;
  documento_identidad: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  genero: string;
  cuentas?: Cuenta[];
};

function generoLabel(raw: string) {
  const g = (raw || '').toUpperCase().trim();
  if (g === 'M') return 'Masculino';
  if (g === 'F') return 'Femenino';
  if (g === 'OTRO') return 'Otro';
  if (g === 'METRO') return 'Masculino';
  return raw || '-';
}

function formatFecha(fecha: string) {
  if (!fecha) return '';
  const [y, m, d] = fecha.split('-').map(Number);
  if (!y || !m || !d) return fecha;

  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export default function ClienteDetallePage() {
  // ✅ La ruta será /clientes/:clienteId
  const { clienteId: clienteIdParam } = useParams();
  const clienteId = Number(clienteIdParam);

  const [data, setData] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cuentas = useMemo(() => data?.cuentas ?? [], [data?.cuentas]);

  const load = useCallback(async () => {
    if (!Number.isFinite(clienteId) || clienteId <= 0) {
      setError('Cliente inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.get<ClienteDetalle>(`/clientes/${clienteId}`);
      setData(res.data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo cargar el detalle del cliente'));
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!Number.isFinite(clienteId) || clienteId <= 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: 24,
          background:
            'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent), radial-gradient(900px 500px at 90% 0%, rgba(34,197,94,0.14), transparent), #0b1220',
          color: 'rgba(255,255,255,0.92)',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Cliente inválido</h2>
        <Link
          to="/clientes"
          style={{
            color: 'rgba(255,255,255,0.92)',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          ⬅️ Volver
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 24,
        background:
          'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent), radial-gradient(900px 500px at 90% 0%, rgba(34,197,94,0.14), transparent), #0b1220',
        color: 'rgba(255,255,255,0.92)',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      }}
    >
      {/* ✅ FULL WIDTH */}
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '14px 16px',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h1 style={{ margin: 0 }}>Detalle del Cliente #{clienteId}</h1>

          <Link
            to="/clientes"
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.92)',
              textDecoration: 'none',
              fontWeight: 800,
            }}
          >
            ⬅️ Volver
          </Link>

          <Link
            to={`/clientes/${clienteId}/cuentas`}
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.55)',
              background:
                'linear-gradient(180deg, rgba(99,102,241,0.38), rgba(99,102,241,0.18))',
              color: 'rgba(255,255,255,0.95)',
              textDecoration: 'none',
              fontWeight: 900,
            }}
          >
            🏦 Ir a cuentas
          </Link>

          <button
            onClick={() => void load()}
            disabled={loading}
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.92)',
              cursor: 'pointer',
              fontWeight: 900,
            }}
          >
            🔄 Recargar
          </button>
        </div>

        {loading ? (
          <div style={{ marginTop: 12 }}>Cargando…</div>
        ) : error ? (
          <div style={{ marginTop: 12, color: '#ff6b6b' }}>❌ {error}</div>
        ) : !data ? (
          <div style={{ marginTop: 12 }}>No se encontró el cliente.</div>
        ) : (
          <>
            {/* Info Cliente */}
            <div
              style={{
                marginTop: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 18,
                padding: 16,
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <h3 style={{ marginTop: 0 }}>👤 Información del cliente</h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ opacity: 0.7 }}>Nombre completo</div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>
                    {data.nombre} {data.paterno} {data.materno}
                  </div>
                </div>

                <div>
                  <div style={{ opacity: 0.7 }}>Documento</div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>
                    {data.tipo_documento} {data.documento_identidad}
                  </div>
                </div>

                <div>
                  <div style={{ opacity: 0.7 }}>Género</div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>
                    {generoLabel(data.genero)}
                  </div>
                </div>

                <div>
                  <div style={{ opacity: 0.7 }}>Fecha de nacimiento</div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>
                    {formatFecha(data.fecha_nacimiento)}
                  </div>
                </div>
              </div>
            </div>

            {/* Cuentas */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>🏦 Cuentas del cliente</h3>
                <Link
                  to={`/clientes/${clienteId}/cuentas`}
                  style={{
                    color: 'rgba(255,255,255,0.92)',
                    textDecoration: 'none',
                    fontWeight: 900,
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  ➕ Administrar cuentas
                </Link>
              </div>

              <div style={{ marginTop: 10 }}>
                {cuentas.length === 0 ? (
                  <div
                    style={{
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(255,255,255,0.04)',
                      opacity: 0.95,
                    }}
                  >
                    Este cliente no tiene cuentas registradas.
                  </div>
                ) : (
                  <div style={{ overflow: 'auto', borderRadius: 18, border: '1px solid rgba(255,255,255,0.10)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                      <thead>
                        <tr style={{ textAlign: 'left' }}>
                          <th style={{ padding: 12, opacity: 0.85 }}>ID</th>
                          <th style={{ padding: 12, opacity: 0.85 }}>Número</th>
                          <th style={{ padding: 12, opacity: 0.85 }}>Tipo</th>
                          <th style={{ padding: 12, opacity: 0.85 }}>Moneda</th>
                          <th style={{ padding: 12, opacity: 0.85 }}>Monto</th>
                          <th style={{ padding: 12, opacity: 0.85 }}>Sucursal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cuentas.map((c) => (
                          <tr
                            key={c.id}
                            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            <td style={{ padding: 12 }}>#{c.id}</td>
                            <td style={{ padding: 12, fontWeight: 900 }}>{c.numero_cuenta}</td>
                            <td style={{ padding: 12 }}>{c.tipo_producto}</td>
                            <td style={{ padding: 12 }}>{c.moneda}</td>
                            <td style={{ padding: 12 }}>{c.monto}</td>
                            <td style={{ padding: 12 }}>{c.sucursal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
