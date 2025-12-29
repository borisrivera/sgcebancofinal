import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

type TipoMovimiento = 'DEPOSITO' | 'RETIRO';

type Movimiento = {
  id: number;
  tipo: TipoMovimiento;
  monto: number;
  descripcion?: string | null;
  cuenta_id: number;
  fecha_creacion: string;
};

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

function formatFechaTime(iso: string) {
  if (!iso) return '';
  const date = new Date(iso);
  return new Intl.DateTimeFormat('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function MovimientosPage() {
  const params = useParams();
  const clienteId = Number(params.clienteId);
  const cuentaId = Number(params.cuentaId);

  const [rows, setRows] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    tipo: 'DEPOSITO' as TipoMovimiento,
    monto: '',
    descripcion: '',
  });

  const canSave = useMemo(() => {
    const monto = Number(form.monto);
    return (
      (form.tipo === 'DEPOSITO' || form.tipo === 'RETIRO') &&
      Number.isFinite(monto) &&
      monto > 0
    );
  }, [form]);

  const invalidParams = !Number.isFinite(clienteId) || clienteId <= 0 || !Number.isFinite(cuentaId) || cuentaId <= 0;

  async function load() {
    if (invalidParams) return;

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Movimiento[]>(`/cuentas/${cuentaId}/movimientos`);
      setRows(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Error cargando movimientos'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuentaId]);

  async function createMovimiento() {
    if (!canSave || invalidParams) return;

    try {
      setSaving(true);
      setError(null);

      await api.post(`/cuentas/${cuentaId}/movimientos`, {
        tipo: form.tipo,
        monto: Number(form.monto),
        descripcion: form.descripcion.trim() ? form.descripcion.trim() : undefined,
      });

      setForm({ tipo: 'DEPOSITO', monto: '', descripcion: '' });
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo guardar el movimiento'));
    } finally {
      setSaving(false);
    }
  }

  if (invalidParams) {
    return (
      <div style={{ minHeight: '100vh', padding: 24, background: '#0b1220', color: 'white' }}>
        <h2>❌ Parámetros inválidos</h2>
        <div>clienteId o cuentaId inválido en la URL.</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/clientes" style={{ color: 'white' }}>⬅️ Volver</Link>
        </div>
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
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 16,
            padding: 14,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>💸 Movimientos</h1>
            <div style={{ opacity: 0.75, marginTop: 4 }}>
              Cliente #{clienteId} — Cuenta #{cuentaId}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              to={`/clientes/${clienteId}/cuentas`}
              style={{
                textDecoration: 'none',
                color: 'white',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.06)',
                fontWeight: 800,
              }}
            >
              ⬅️ Volver a cuentas
            </Link>

            <button
              onClick={() => void load()}
              disabled={loading || saving}
              style={{
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🔄 Recargar
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 18,
            padding: 16,
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <h3 style={{ margin: 0 }}>➕ Crear movimiento</h3>
          <div style={{ opacity: 0.75, marginTop: 6 }}>Depósito o retiro (actualiza saldo automáticamente).</div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 12,
              marginTop: 12,
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Tipo</div>
              <select
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as TipoMovimiento }))}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'white',
                  boxSizing: 'border-box',
                  minWidth: 0,
                }}
              >
                <option value="DEPOSITO">DEPÓSITO</option>
                <option value="RETIRO">RETIRO</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Monto</div>
              <input
                value={form.monto}
                onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
                placeholder="Ej: 10.50"
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'white',
                  boxSizing: 'border-box',
                  minWidth: 0,
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Descripción (opcional)</div>
              <input
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                placeholder="Ej: pago, depósito inicial..."
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'white',
                  boxSizing: 'border-box',
                  minWidth: 0,
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <button
                onClick={() => void createMovimiento()}
                disabled={!canSave || saving}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(34,197,94,0.55)',
                  background:
                    'linear-gradient(180deg, rgba(34,197,94,0.30), rgba(34,197,94,0.14))',
                  color: 'white',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                {saving ? 'Guardando…' : '✅ Guardar movimiento'}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                borderRadius: 14,
                border: '1px solid rgba(239,68,68,0.35)',
                background: 'rgba(239,68,68,0.10)',
              }}
            >
              ❌ {error}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 16,
            overflow: 'auto',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>ID</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>Fecha</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>Tipo</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>Monto</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 12 }}>Cargando…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 12 }}>No hay movimientos todavía.</td>
                </tr>
              ) : (
                rows.map((m) => (
                  <tr key={m.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: 12 }}>#{m.id}</td>
                    <td style={{ padding: 12 }}>{formatFechaTime(m.fecha_creacion)}</td>
                    <td style={{ padding: 12, fontWeight: 900 }}>
                      {m.tipo === 'DEPOSITO' ? '✅ DEPÓSITO' : '⬇️ RETIRO'}
                    </td>
                    <td style={{ padding: 12 }}>{Number(m.monto).toFixed(2)}</td>
                    <td style={{ padding: 12, opacity: 0.85 }}>{m.descripcion ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
