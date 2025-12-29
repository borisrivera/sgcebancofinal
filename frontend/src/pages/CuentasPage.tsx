import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

type CuentaTipo = 'AHORRO' | 'CORRIENTE';

type Cliente = {
  id: number;
  nombre: string;
  paterno: string;
  materno: string;
  tipo_documento: string;
  documento_identidad: string;
};

type Cuenta = {
  id: number;
  numero_cuenta: string;
  tipo: CuentaTipo;
  saldo: number;
  moneda: string; // ej: BOB
  createdAt?: string;
  cliente_id: number;
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

function normalizeMoneda(raw: string) {
  const m = (raw || 'BOB').trim().toUpperCase();

  if (m === 'BOB') return 'BOB';
  return m;
}

function money(n: number, moneda: string) {
  const value = Number.isFinite(n) ? n : 0;
  const currency = normalizeMoneda(moneda);

  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: currency || 'BOB',
    maximumFractionDigits: 2,
  }).format(value);
}

const endpoints = {
  cliente: (clienteId: number) => `/clientes/${clienteId}`,
  listCuentas: (clienteId: number) => `/clientes/${clienteId}/cuentas`,
  createCuenta: (clienteId: number) => `/clientes/${clienteId}/cuentas`,
  updateCuenta: (cuentaId: number) => `/clientes/cuentas/${cuentaId}`,
  deleteCuenta: (cuentaId: number) => `/clientes/cuentas/${cuentaId}`,

  // ✅ Movimientos (nuevo)
  movimientos: (clienteId: number, cuentaId: number) =>
    `/clientes/${clienteId}/cuentas/${cuentaId}/movimientos`,
};

type CuentaForm = {
  numero_cuenta: string;
  tipo: CuentaTipo;
  saldo: string; // string en UI
  moneda: string;
};

const emptyForm: CuentaForm = {
  numero_cuenta: '',
  tipo: 'AHORRO',
  saldo: '0',
  moneda: 'BOB',
};

export default function CuentasPage() {
  const params = useParams();
  const clienteId = Number(params.clienteId);

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CuentaForm>({ ...emptyForm });

  const invalidClienteId = !Number.isFinite(clienteId) || clienteId <= 0;

  const canSave = useMemo(() => {
    return (
      form.numero_cuenta.trim().length >= 4 &&
      (form.tipo === 'AHORRO' || form.tipo === 'CORRIENTE') &&
      normalizeMoneda(form.moneda).trim().length >= 3 &&
      form.saldo.trim().length >= 1
    );
  }, [form]);

  async function load() {
    if (invalidClienteId) {
      setError('clienteId inválido en la URL');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1) Cliente
      const cRes = await api.get<Cliente>(endpoints.cliente(clienteId));
      setCliente(cRes.data);

      // 2) Cuentas (ordenadas)
      const cuentasRes = await api.get<Cuenta[]>(endpoints.listCuentas(clienteId));

      // ✅ FIX CLAVE: normalizamos la moneda al cargar
      const normalized = (cuentasRes.data || []).map((c) => ({
        ...c,
        moneda: normalizeMoneda(c.moneda),
      }));

      const sorted = [...normalized].sort((a, b) => b.id - a.id);
      setCuentas(sorted);
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Error cargando cliente/cuentas'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  async function createCuenta() {
    if (!canSave || invalidClienteId) return;

    try {
      setSaving(true);
      setError(null);

      const saldoNumber = Number(form.saldo);
      if (!Number.isFinite(saldoNumber)) {
        setError('Saldo inválido');
        return;
      }

      
      const moneda = normalizeMoneda(form.moneda);

      await api.post(endpoints.createCuenta(clienteId), {
        numero_cuenta: form.numero_cuenta.trim(),
        tipo: form.tipo,
        saldo: saldoNumber,
        moneda,
      });

      setForm({ ...emptyForm });
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo crear la cuenta'));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCuenta(cuentaId: number) {
    const ok = confirm('¿Eliminar esta cuenta?');
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);
      await api.delete(endpoints.deleteCuenta(cuentaId));
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo eliminar la cuenta'));
    } finally {
      setSaving(false);
    }
  }

  if (invalidClienteId) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: 24,
          background: '#0b1220',
          color: 'rgba(255,255,255,0.92)',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <h2 style={{ marginTop: 0 }}>❌ clienteId inválido</h2>
        <div style={{ opacity: 0.85 }}>Revisa la URL. Debe ser algo como: /clientes/1/cuentas</div>
        <div style={{ marginTop: 12 }}>
          <Link
            to="/clientes"
            style={{
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.92)',
              textDecoration: 'none',
              fontWeight: 900,
              display: 'inline-block',
            }}
          >
            ⬅️ Volver a Clientes
          </Link>
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
      {/* ✅ FULL FULL: sin límite de 1120 */}
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 22 }}>🏦 Cuentas</h1>
            <div style={{ opacity: 0.8, marginTop: 6 }}>
              {cliente ? (
                <>
                  Cliente:{' '}
                  <b>
                    {cliente.nombre} {cliente.paterno} {cliente.materno}
                  </b>{' '}
                  — {cliente.tipo_documento} {cliente.documento_identidad}
                </>
              ) : (
                'Cargando cliente...'
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading || saving}
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

            <Link
              to="/clientes"
              style={{
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.92)',
                textDecoration: 'none',
                fontWeight: 900,
              }}
            >
              ⬅️ Volver
            </Link>
          </div>
        </div>

        {/* Crear cuenta */}
        <div
          style={{
            marginTop: 16,
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            padding: 16,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16 }}>➕ Crear cuenta</h3>
          <div style={{ marginTop: 6, opacity: 0.8 }}>Complete los datos y guarde.</div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
              marginTop: 12,
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Número de cuenta</div>
              <input
                value={form.numero_cuenta}
                onChange={(e) => setForm((p) => ({ ...p, numero_cuenta: e.target.value }))}
                placeholder="Ej: 100200300"
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'rgba(255,255,255,0.92)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Tipo</div>
              <select
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as CuentaTipo }))}
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'rgba(255,255,255,0.92)',
                  outline: 'none',
                }}
              >
                <option value="AHORRO">Ahorro</option>
                <option value="CORRIENTE">Corriente</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Saldo</div>
              <input
                value={form.saldo}
                onChange={(e) => setForm((p) => ({ ...p, saldo: e.target.value }))}
                placeholder="0"
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'rgba(255,255,255,0.92)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Moneda</div>
              <select
                value={form.moneda}
                onChange={(e) => setForm((p) => ({ ...p, moneda: normalizeMoneda(e.target.value) }))}
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.18)',
                  color: 'rgba(255,255,255,0.92)',
                  outline: 'none',
                }}
              >
                <option value="BOB">BOB</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'end', minWidth: 0 }}>
              <button
                type="button"
                onClick={() => void createCuenta()}
                disabled={!canSave || saving}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(34,197,94,0.55)',
                  background: 'linear-gradient(180deg, rgba(34,197,94,0.28), rgba(34,197,94,0.12))',
                  color: 'rgba(255,255,255,0.95)',
                  cursor: 'pointer',
                  fontWeight: 950,
                }}
              >
                {saving ? 'Guardando…' : '✅ Guardar cuenta'}
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

        {/* Tabla cuentas */}
        <div
          style={{
            marginTop: 16,
            overflow: 'auto',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead>
              <tr>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 12, opacity: 0.85 }}>ID</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 12, opacity: 0.85 }}>Número</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 12, opacity: 0.85 }}>Tipo</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 12, opacity: 0.85 }}>Saldo</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 12, opacity: 0.85 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={{ padding: 12 }} colSpan={5}>
                    Cargando…
                  </td>
                </tr>
              ) : cuentas.length === 0 ? (
                <tr>
                  <td style={{ padding: 12 }} colSpan={5}>
                    No hay cuentas para este cliente.
                  </td>
                </tr>
              ) : (
                cuentas.map((c) => (
                  <tr key={c.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: 12 }}>#{c.id}</td>
                    <td style={{ padding: 12, fontWeight: 900 }}>{c.numero_cuenta}</td>
                    <td style={{ padding: 12 }}>{c.tipo === 'AHORRO' ? 'Ahorro' : 'Corriente'}</td>
                    <td style={{ padding: 12 }}>{money(Number(c.saldo), c.moneda || 'BOB')}</td>

                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {/* ✅ NUEVO: Movimientos */}
                        <Link
                          to={endpoints.movimientos(clienteId, c.id)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.14)',
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.92)',
                            textDecoration: 'none',
                            fontWeight: 900,
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          💸 Movimientos
                        </Link>

                        <button
                          type="button"
                          onClick={() => void deleteCuenta(c.id)}
                          disabled={saving}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 12,
                            border: '1px solid rgba(239,68,68,0.55)',
                            background:
                              'linear-gradient(180deg, rgba(239,68,68,0.30), rgba(239,68,68,0.14))',
                            color: 'rgba(255,255,255,0.95)',
                            cursor: 'pointer',
                            fontWeight: 950,
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Si al cargar no aparecen cuentas, revisa el Swagger: los endpoints se pueden ajustar arriba en el
          objeto <b>endpoints</b> sin tocar el resto.
        </div>
      </div>
    </div>
  );
}
