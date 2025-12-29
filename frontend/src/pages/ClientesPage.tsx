import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Genero = 'M' | 'F' | 'Otro';

type Cliente = {
  id: number;
  nombre: string;
  paterno: string;
  materno: string;
  tipo_documento: string;
  documento_identidad: string;
  fecha_nacimiento: string;
  genero: string;
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

function generoLabel(raw: string) {
  const g = (raw || '').toUpperCase().trim();
  if (g === 'M') return 'Masculino';
  if (g === 'F') return 'Femenino';
  if (g === 'OTRO') return 'Otro';
  if (g === 'Masculino') return 'Masculino';
  return raw;
}

function normalizeGenero(raw: string): Genero {
  const g = (raw || '').toUpperCase().trim();
  if (g === 'M') return 'M';
  if (g === 'F') return 'F';
  return 'Otro';
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

type ClienteForm = {
  nombre: string;
  paterno: string;
  materno: string;
  tipo_documento: string;
  documento_identidad: string;
  fecha_nacimiento: string;
  genero: Genero;
};

const emptyForm: ClienteForm = {
  nombre: '',
  paterno: '',
  materno: '',
  tipo_documento: 'CI',
  documento_identidad: '',
  fecha_nacimiento: '',
  genero: 'M',
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: 24,
    background:
      'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent), radial-gradient(900px 500px at 90% 0%, rgba(34,197,94,0.14), transparent), #0b1220',
    color: 'rgba(255, 255, 255, 0.92)',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    overflowX: 'hidden' as const,
  } as const,

  container: {
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
  } as const,

  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(10px)',
    flexWrap: 'wrap' as const,
  } as const,

  title: { margin: 0, fontSize: 22, letterSpacing: 0.2 } as const,

  badgeRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap' as const,
    alignItems: 'center' as const,
    marginTop: 6,
  } as const,

  badge: {
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255, 255, 255, 0.05)',
    whiteSpace: 'nowrap' as const,
  } as const,

  row: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap' as const,
    alignItems: 'center' as const,
  } as const,

  btn: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.14)',
    background: 'rgba(255, 255, 255, 0.06)',
    color: 'rgba(255, 255, 255, 0.92)',
    cursor: 'pointer',
    fontWeight: 700,
  } as const,

  btnPrimary: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(99,102,241,0.55)',
    background: 'linear-gradient(180deg, rgba(99,102,241,0.38), rgba(99,102,241,0.18))',
    color: 'rgba(255, 255, 255, 0.95)',
    cursor: 'pointer',
    fontWeight: 800,
  } as const,

  btnDanger: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid rgba(239,68,68,0.55)',
    background: 'linear-gradient(180deg, rgba(239,68,68,0.30), rgba(239,68,68,0.14))',
    color: 'rgba(255, 255, 255, 0.95)',
    cursor: 'pointer',
    fontWeight: 800,
  } as const,

  card: {
    marginTop: 16,
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.04)',
    padding: 16,
  } as const,

  cardTitle: { margin: 0, fontSize: 16 } as const,
  sub: { marginTop: 6, opacity: 0.8 } as const,

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
    marginTop: 12,
    minWidth: 0,
  } as const,

  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    minWidth: 0,
  } as const,

  label: { fontSize: 12, opacity: 0.8 } as const,

  input: {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box' as const,
    padding: 10,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.18)',
    color: 'rgba(255, 255, 255, 0.92)',
    outline: 'none',
  } as const,

  saveWrap: { display: 'flex', alignItems: 'end', minWidth: 0 } as const,

  tableWrap: {
    marginTop: 16,
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    WebkitOverflowScrolling: 'touch' as const,
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.03)',
    maxWidth: '100%',
  } as const,

  table: { width: '100%', borderCollapse: 'collapse' as const, minWidth: 780 } as const,

  th: {
    padding: '12px 12px',
    textAlign: 'left' as const,
    fontSize: 12,
    letterSpacing: 0.3,
    opacity: 0.85,
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    whiteSpace: 'nowrap' as const,
  } as const,

  td: {
    padding: '12px 12px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    verticalAlign: 'top' as const,
  } as const,

  link: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    padding: '8px 10px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    fontWeight: 800,
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
  } as const,

  alert: {
    marginTop: 12,
    padding: '10px 12px',
    borderRadius: 14,
    border: '1px solid rgba(239,68,68,0.35)',
    background: 'rgba(239,68,68,0.10)',
    color: 'rgba(255,255,255,0.92)',
  } as const,

  responsiveHint: {
    marginTop: 10,
    opacity: 0.65,
    fontSize: 12,
  } as const,
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ClienteForm>({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ClienteForm>({ ...emptyForm });

  const canCreate = useMemo(() => {
    return (
      form.nombre.trim().length >= 2 &&
      form.paterno.trim().length >= 2 &&
      form.materno.trim().length >= 2 &&
      form.tipo_documento.trim().length >= 1 &&
      form.documento_identidad.trim().length >= 3 &&
      form.fecha_nacimiento.trim().length >= 8
    );
  }, [form]);

  const canUpdate = useMemo(() => {
    return (
      editForm.nombre.trim().length >= 2 &&
      editForm.paterno.trim().length >= 2 &&
      editForm.materno.trim().length >= 2 &&
      editForm.tipo_documento.trim().length >= 1 &&
      editForm.documento_identidad.trim().length >= 3 &&
      editForm.fecha_nacimiento.trim().length >= 8
    );
  }, [editForm]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Cliente[]>('/clientes');
      setClientes(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Error cargando clientes'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createCliente() {
    if (!canCreate) return;

    try {
      setSaving(true);
      setError(null);
      await api.post('/clientes', { ...form, genero: form.genero });
      setForm({ ...emptyForm });
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'Error guardando cliente'));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(c: Cliente) {
    setEditingId(c.id);
    setEditForm({
      nombre: c.nombre,
      paterno: c.paterno,
      materno: c.materno,
      tipo_documento: c.tipo_documento,
      documento_identidad: c.documento_identidad,
      fecha_nacimiento: c.fecha_nacimiento,
      genero: normalizeGenero(c.genero),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ ...emptyForm });
  }

  async function updateCliente(id: number) {
    if (!canUpdate) return;

    try {
      setSaving(true);
      setError(null);
      await api.put(`/clientes/${id}`, { ...editForm, genero: editForm.genero });
      cancelEdit();
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo actualizar el cliente'));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCliente(id: number) {
    const ok = confirm('¿Eliminar este cliente?');
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);
      await api.delete(`/clientes/${id}`);
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo eliminar el cliente'));
    } finally {
      setSaving(false);
    }
  }

  async function fixGenerosDB() {
    try {
      setError(null);
      await api.get('/clientes/fix-generos');
      await load();
    } catch (e: unknown) {
      setError(getErrorMessage(e, 'No se pudo limpiar'));
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <div style={{ minWidth: 0 }}>
            <h1 style={styles.title}>👤 Clientes</h1>
            <div style={styles.badgeRow}>
              <span style={styles.badge}>📦 Clientes CRUD</span>
              <span style={styles.badge}>🏦 Cuentas por cliente</span>
              <span style={styles.badge}>🔎 Búsqueda + Filtros</span>
            </div>
          </div>

          <div style={styles.row}>
            <button type="button" style={styles.btn} onClick={() => void load()} disabled={loading || saving}>
              🔄 Recargar
            </button>
            <button type="button" style={styles.btn} onClick={() => void fixGenerosDB()} disabled={saving}>
              🧹 Limpiar
            </button>
          </div>
        </div>

        {/* Crear */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>➕ Crear cliente</h3>
          <div style={styles.sub}>Complete el formulario y guárdelo.</div>

          <div className="__grid2" style={styles.grid}>
            <div style={styles.field}>
              <div style={styles.label}>Nombre</div>
              <input
                style={styles.input}
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: Juan"
              />
            </div>

            <div style={styles.field}>
              <div style={styles.label}>Paterno</div>
              <input
                style={styles.input}
                value={form.paterno}
                onChange={(e) => setForm((p) => ({ ...p, paterno: e.target.value }))}
                placeholder="Ej: Pérez"
              />
            </div>

            <div style={styles.field}>
              <div style={styles.label}>Materno</div>
              <input
                style={styles.input}
                value={form.materno}
                onChange={(e) => setForm((p) => ({ ...p, materno: e.target.value }))}
                placeholder="Ej: López"
              />
            </div>

            <div style={styles.field}>
              <div style={styles.label}>Tipo de documento</div>
              <select
                style={styles.input}
                value={form.tipo_documento}
                onChange={(e) => setForm((p) => ({ ...p, tipo_documento: e.target.value }))}
              >
                <option value="CI">CI</option>
                <option value="PAS">PAS</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            <div style={styles.field}>
              <div style={styles.label}>N° de documento</div>
              <input
                style={styles.input}
                value={form.documento_identidad}
                onChange={(e) => setForm((p) => ({ ...p, documento_identidad: e.target.value }))}
                placeholder="Ej: 1234567"
              />
            </div>

            <div style={styles.field}>
              <div style={styles.label}>Fecha de nacimiento</div>
              <input
                style={styles.input}
                type="date"
                value={form.fecha_nacimiento}
                onChange={(e) => setForm((p) => ({ ...p, fecha_nacimiento: e.target.value }))}
              />
            </div>

            <div style={styles.field}>
              <div style={styles.label}>Género</div>
              <select
                style={styles.input}
                value={form.genero}
                onChange={(e) => setForm((p) => ({ ...p, genero: e.target.value as Genero }))}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div style={styles.saveWrap}>
              <button
                type="button"
                style={styles.btnPrimary}
                onClick={() => void createCliente()}
                disabled={!canCreate || saving}
              >
                {saving ? 'Guardando…' : '✅ Guardar'}
              </button>
            </div>
          </div>

          <div style={styles.responsiveHint}>
            Tip: en móvil el formulario baja a 1 columna y la tabla hace scroll solo dentro de ella.
          </div>

          {error && <div style={styles.alert}>❌ {error}</div>}
        </div>

        {/* Lista */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>IDENTIFICACIÓN</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Documento</th>
                <th style={styles.th}>Género</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={styles.td} colSpan={5}>
                    Cargando…
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={5}>
                    No hay clientes.
                  </td>
                </tr>
              ) : (
                clientes.map((c) => {
                  const isEditing = editingId === c.id;

                  return (
                    <tr key={c.id}>
                      <td style={styles.td}>#{c.id}</td>

                      <td style={styles.td}>
                        {isEditing ? (
                          <div
                            key={`edit-nombre-${c.id}`} // ✅ fuerza remount
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                              gap: 8,
                              minWidth: 0,
                            }}
                          >
                            <input
                              style={styles.input}
                              value={editForm.nombre}
                              onChange={(e) => setEditForm((p) => ({ ...p, nombre: e.target.value }))}
                            />
                            <input
                              style={styles.input}
                              value={editForm.paterno}
                              onChange={(e) => setEditForm((p) => ({ ...p, paterno: e.target.value }))}
                            />
                            <input
                              style={styles.input}
                              value={editForm.materno}
                              onChange={(e) => setEditForm((p) => ({ ...p, materno: e.target.value }))}
                            />
                          </div>
                        ) : (
                          <div key={`view-nombre-${c.id}` /* ✅ fuerza remount */}>
                            <div style={{ fontWeight: 800 }}>
                              {c.nombre} {c.paterno} {c.materno}
                            </div>
                            <div style={{ opacity: 0.75, fontSize: 12 }}>🎂 {formatFecha(c.fecha_nacimiento)}</div>
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {isEditing ? (
                          <div
                            key={`edit-doc-${c.id}`} // ✅ fuerza remount
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '120px minmax(0, 1fr)',
                              gap: 8,
                              minWidth: 0,
                            }}
                          >
                            <select
                              style={styles.input}
                              value={editForm.tipo_documento}
                              onChange={(e) => setEditForm((p) => ({ ...p, tipo_documento: e.target.value }))}
                            >
                              <option value="CI">CI</option>
                              <option value="PAS">PAS</option>
                              <option value="NIT">NIT</option>
                            </select>
                            <input
                              style={styles.input}
                              value={editForm.documento_identidad}
                              onChange={(e) => setEditForm((p) => ({ ...p, documento_identidad: e.target.value }))}
                            />
                          </div>
                        ) : (
                          <div key={`view-doc-${c.id}`} style={{ fontWeight: 700 }}>
                            {c.tipo_documento} {c.documento_identidad}
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {isEditing ? (
                          <div
                            key={`edit-gen-${c.id}`} // ✅ fuerza remount
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                              gap: 8,
                              minWidth: 0,
                            }}
                          >
                            <select
                              style={styles.input}
                              value={editForm.genero}
                              onChange={(e) => setEditForm((p) => ({ ...p, genero: e.target.value as Genero }))}
                            >
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                              <option value="Otro">Otro</option>
                            </select>

                            <input
                              style={styles.input}
                              type="date"
                              value={editForm.fecha_nacimiento}
                              onChange={(e) => setEditForm((p) => ({ ...p, fecha_nacimiento: e.target.value }))}
                            />
                          </div>
                        ) : (
                          <div key={`view-gen-${c.id}`} style={{ fontWeight: 800 }}>
                            {generoLabel(c.genero)}
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {isEditing ? (
                          <div key={`edit-actions-${c.id}`} style={styles.row}>
                            <button
                              type="button"
                              style={styles.btnPrimary}
                              onClick={() => void updateCliente(c.id)}
                              disabled={!canUpdate || saving}
                            >
                              💾 Guardar
                            </button>
                            <button type="button" style={styles.btn} onClick={cancelEdit} disabled={saving}>
                              ✖️ Cancelar
                            </button>
                          </div>
                        ) : (
                          <div key={`view-actions-${c.id}`} style={styles.row}>
                            <Link style={styles.link} to={`/clientes/${c.id}`}>
                              👁️ Detalle
                            </Link>
                            <Link style={styles.link} to={`/clientes/${c.id}/cuentas`}>
                              🏦 Cuentas
                            </Link>
                            <button type="button" style={styles.btn} onClick={() => startEdit(c)} disabled={saving}>
                              ✏️ Editar
                            </button>
                            <button
                              type="button"
                              style={styles.btnDanger}
                              onClick={() => void deleteCliente(c.id)}
                              disabled={saving}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .__grid2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
