import { useState, useRef, useEffect, useCallback } from "react";

// ─── INITIAL DATA (simula Airtable como backend) ─────────────────────────────
const CURRENT_USER = { name: "Empresa Demo S.A.", plan: "Pro", avatar: "ED", since: "Ene 2025" };

const INITIAL_PROJECTS = [
  { id: 1, name: "Rediseño Web Corporativo", status: "En progreso", progress: 68, dueDate: "2026-04-15", manager: "Ana López", budget: 85000, spent: 57800, tags: ["Diseño", "Dev"], log: [] },
  { id: 2, name: "Integración CRM + ERP", status: "Revisión", progress: 91, dueDate: "2026-03-28", manager: "Carlos Vega", budget: 120000, spent: 109000, tags: ["Backend", "IA"], log: [] },
  { id: 3, name: "App Móvil Flutter", status: "Planificación", progress: 12, dueDate: "2026-06-30", manager: "Sofia Castro", budget: 200000, spent: 18000, tags: ["Mobile", "Flutter"], log: [] },
  { id: 4, name: "Dashboard Analytics", status: "Completado", progress: 100, dueDate: "2026-02-28", manager: "Miguel Torres", budget: 45000, spent: 43200, tags: ["Data", "BI"], log: [] },
];

const INITIAL_INVOICES = [
  { id: "FAC-2026-031", date: "2026-03-01", concept: "Desarrollo Sprint 6 — CRM", amount: 28500, status: "Pagada", dueDate: "2026-03-15" },
  { id: "FAC-2026-028", date: "2026-02-15", concept: "Diseño UI — Web Corporativo", amount: 15000, status: "Pagada", dueDate: "2026-03-01" },
  { id: "FAC-2026-035", date: "2026-03-10", concept: "Backend API REST + Documentación", amount: 32000, status: "Pendiente", dueDate: "2026-03-25" },
  { id: "FAC-2026-038", date: "2026-03-18", concept: "Onboarding App Móvil — Sprint 1", amount: 18000, status: "Vencida", dueDate: "2026-03-20" },
];

const INITIAL_TICKETS = [
  { id: "TKT-0041", title: "Error al exportar reportes PDF", priority: "Alta", status: "Abierto", created: "2026-03-18", project: "Dashboard Analytics", description: "" },
  { id: "TKT-0039", title: "Ajuste de colores en dashboard móvil", priority: "Baja", status: "En progreso", created: "2026-03-15", project: "App Móvil Flutter", description: "" },
  { id: "TKT-0037", title: "Configurar webhook de pagos Stripe", priority: "Media", status: "Resuelto", created: "2026-03-10", project: "Integración CRM + ERP", description: "" },
  { id: "TKT-0035", title: "Optimizar velocidad de carga home page", priority: "Media", status: "Resuelto", created: "2026-03-05", project: "Rediseño Web Corporativo", description: "" },
];

const INITIAL_DOCUMENTS = [
  { id: 1, name: "Propuesta Técnica — App Móvil.pdf", type: "PDF", size: "2.4 MB", date: "2026-03-01", project: "App Móvil Flutter" },
  { id: 2, name: "Contrato de Servicios 2026.pdf", type: "PDF", size: "0.8 MB", date: "2026-01-15", project: "General" },
  { id: 3, name: "Wireframes UI v3.fig", type: "Figma", size: "18.2 MB", date: "2026-03-12", project: "Rediseño Web Corporativo" },
  { id: 4, name: "Manual de Usuario Dashboard.pdf", type: "PDF", size: "1.1 MB", date: "2026-02-28", project: "Dashboard Analytics" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hace un momento";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
};

const fileTypeFromName = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "fig") return "Figma";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "IMG";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xls", "xlsx"].includes(ext)) return "XLS";
  if (["zip", "rar"].includes(ext)) return "ZIP";
  return ext.toUpperCase();
};

const STATUS_STYLES = {
  "En progreso": { bg: "#EFF6FF", color: "#2563EB", dot: "#3B82F6" },
  "Revisión":    { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "Planificación": { bg: "#F5F3FF", color: "#6D28D9", dot: "#8B5CF6" },
  "Completado":  { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
  "Pagada":      { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
  "Pendiente":   { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "Vencida":     { bg: "#FFF1F2", color: "#BE123C", dot: "#F43F5E" },
  "Abierto":     { bg: "#FFF1F2", color: "#BE123C", dot: "#F43F5E" },
  "En progreso_ticket": { bg: "#EFF6FF", color: "#2563EB", dot: "#3B82F6" },
  "Resuelto":    { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
};

const PRIORITY = { "Alta": "#EF4444", "Media": "#F59E0B", "Baja": "#10B981" };

const TICKET_STATUS_FLOW = ["Abierto", "En progreso", "Resuelto"];

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function ProgressBar({ value, color = "#6366F1" }) {
  return (
    <div style={{ height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: value === 100 ? "#22C55E" : color,
        borderRadius: 3, transition: "width 0.8s ease",
      }} />
    </div>
  );
}

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#F0FDF4" : t.type === "error" ? "#FFF1F2" : "#EFF6FF",
          border: `1px solid ${t.type === "success" ? "#BBF7D0" : t.type === "error" ? "#FECDD3" : "#BFDBFE"}`,
          color: t.type === "success" ? "#15803D" : t.type === "error" ? "#BE123C" : "#1D4ED8",
          borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          animation: "fadeUp 0.3s ease", display: "flex", alignItems: "center", gap: 10,
          minWidth: 280, maxWidth: 400, fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{ fontSize: 16 }}>{t.type === "success" ? "\u2713" : t.type === "error" ? "\u2717" : "\u2139"}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => onDismiss(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 14,
            color: "inherit", opacity: 0.6, padding: 0, lineHeight: 1,
          }}>&times;</button>
        </div>
      ))}
    </div>
  );
}

// ─── SECCIONES ────────────────────────────────────────────────────────────────
function ProjectsView({ projects, onUpdateProgress }) {
  const [editingId, setEditingId] = useState(null);
  const [sliderVal, setSliderVal] = useState(0);

  const startEdit = (p) => {
    setEditingId(p.id);
    setSliderVal(p.progress);
  };

  const confirmEdit = (p) => {
    onUpdateProgress(p.id, sliderVal);
    setEditingId(null);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {projects.map((p, i) => (
          <div key={p.id} style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
            cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>PM: {p.manager} · Entrega {p.dueDate}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>Progreso</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
                  {editingId !== p.id && (
                    <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} style={{
                      background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 4,
                      fontSize: 9, color: "#6366F1", cursor: "pointer", padding: "2px 6px", fontWeight: 600,
                    }}>Editar</button>
                  )}
                </div>
              </div>
              {editingId === p.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <input type="range" min={0} max={100} value={sliderVal}
                    onChange={e => setSliderVal(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#6366F1", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", minWidth: 32, textAlign: "right" }}>{sliderVal}%</span>
                  <button onClick={() => confirmEdit(p)} style={{
                    background: "#6366F1", border: "none", borderRadius: 6,
                    padding: "4px 10px", fontSize: 11, color: "#fff", cursor: "pointer", fontWeight: 700,
                  }}>OK</button>
                  <button onClick={() => setEditingId(null)} style={{
                    background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 6,
                    padding: "4px 8px", fontSize: 11, color: "#64748B", cursor: "pointer",
                  }}>X</button>
                </div>
              ) : (
                <ProgressBar value={p.progress} />
              )}
            </div>
            {/* Activity log */}
            {p.log && p.log.length > 0 && (
              <div style={{ marginBottom: 8, borderTop: "1px solid #F1F5F9", paddingTop: 6 }}>
                {p.log.slice(-2).map((entry, li) => (
                  <p key={li} style={{ margin: "2px 0", fontSize: 10, color: "#94A3B8", fontStyle: "italic" }}>
                    {entry.text} — {timeAgo(entry.ts)}
                  </p>
                ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>Presupuesto</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{fmt(p.budget)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>Ejercido</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.spent / p.budget > 0.9 ? "#EF4444" : "#10B981" }}>{fmt(p.spent)}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#F1F5F9", color: "#64748B", fontWeight: 600, letterSpacing: "0.05em" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoicesView({ invoices, onMarkPaid, onNewInvoice }) {
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status !== "Pagada").reduce((s, i) => s + i.amount, 0);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={onNewInvoice} style={{
          background: "#6366F1", border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 12, fontWeight: 700,
          color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(99,102,241,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}
        >
          + Nueva Factura
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Facturado", value: fmt(total), color: "#6366F1" },
          { label: "Por Cobrar", value: fmt(pending), color: "#F59E0B", highlight: pending > 0 },
          { label: "Facturas", value: invoices.length, color: "#10B981" },
        ].map((k, i) => (
          <div key={i} style={{
            background: "#fff", border: k.highlight ? "2px solid #F59E0B" : "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px",
            boxShadow: k.highlight ? "0 2px 12px rgba(245,158,11,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
            position: "relative", overflow: "hidden",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {k.highlight && (
              <span style={{
                position: "absolute", top: 8, right: 10,
                fontSize: 9, fontWeight: 800, color: "#fff",
                background: "#F59E0B", padding: "2px 8px", borderRadius: 10,
                letterSpacing: "0.05em",
              }}>
                PENDIENTE
              </span>
            )}
            <p style={{ margin: "0 0 4px", fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace" }}>{k.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto auto", padding: "10px 18px", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}>
          {["No. Factura", "Concepto", "Monto", "Vencimiento", "Estado", "Acción"].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        {invoices.map((inv, i) => (
          <div key={inv.id} style={{
            display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto auto",
            padding: "13px 18px", borderBottom: i < invoices.length - 1 ? "1px solid #F8FAFC" : "none",
            alignItems: "center", gap: 8,
            animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FAFBFE"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366F1", fontFamily: "'DM Mono', monospace" }}>{inv.id}</span>
            <span style={{ fontSize: 12, color: "#334155" }}>{inv.concept}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontFamily: "'DM Mono', monospace" }}>{fmt(inv.amount)}</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{inv.dueDate}</span>
            <StatusBadge status={inv.status} />
            <div>
              {inv.status !== "Pagada" ? (
                <button onClick={() => onMarkPaid(inv.id)} style={{
                  background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6,
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#15803D",
                  cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#DCFCE7"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F0FDF4"; }}
                >
                  Marcar pagada
                </button>
              ) : (
                <span style={{ fontSize: 10, color: "#94A3B8" }}>—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketsView({ tickets, onNewTicket, onChangeStatus }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={onNewTicket} style={{
          background: "#6366F1", border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 12, fontWeight: 700,
          color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(99,102,241,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}
        >
          + Nuevo Ticket
        </button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {tickets.map((t, i) => (
          <div key={t.id} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto auto",
            padding: "14px 18px", borderBottom: i < tickets.length - 1 ? "1px solid #F8FAFC" : "none",
            alignItems: "center", gap: 14,
            animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FAFBFE"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>{t.id}</span>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>{t.project} · {t.created}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY[t.priority] }}>&#9679; {t.priority}</span>
            <StatusBadge status={t.status} />
            <div>
              {t.status !== "Resuelto" ? (
                <button onClick={() => onChangeStatus(t.id)} style={{
                  background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 6,
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#4F46E5",
                  cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#C7D2FE"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#EEF2FF"; }}
                >
                  {t.status === "Abierto" ? "Iniciar" : "Resolver"}
                </button>
              ) : (
                <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>Cerrado</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsView({ documents, onUpload }) {
  const fileInputRef = useRef(null);
  const FILE_ICONS = {
    PDF: { icon: "PDF", bg: "#FEE2E2", color: "#DC2626", border: "#FECACA" },
    Figma: { icon: "FIG", bg: "#F3E8FF", color: "#7C3AED", border: "#DDD6FE" },
    IMG: { icon: "IMG", bg: "#FEF3C7", color: "#D97706", border: "#FDE68A" },
    DOC: { icon: "DOC", bg: "#DBEAFE", color: "#2563EB", border: "#BFDBFE" },
    XLS: { icon: "XLS", bg: "#D1FAE5", color: "#059669", border: "#A7F3D0" },
    ZIP: { icon: "ZIP", bg: "#E0E7FF", color: "#4338CA", border: "#C7D2FE" },
    default: { icon: "FILE", bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0" },
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      onUpload({
        name: file.name,
        type: fileTypeFromName(file.name),
        size: `${sizeMB} MB`,
        project: "General",
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileSelect} />
        <button onClick={() => fileInputRef.current?.click()} style={{
          background: "#6366F1", border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 12, fontWeight: 700,
          color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(99,102,241,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}
        >
          + Subir Documento
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {documents.map((d, i) => {
          const fi = FILE_ICONS[d.type] || FILE_ICONS.default;
          return (
            <div key={d.id} style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
              padding: "14px 16px", display: "flex", gap: 12, alignItems: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s",
              animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: fi.bg, border: `1px solid ${fi.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: fi.color,
                fontFamily: "'DM Mono', monospace",
                flexShrink: 0,
              }}>
                {fi.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#94A3B8" }}>{d.project} · {d.size} · {d.date}</p>
              </div>
              <button style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6,
                padding: "5px 10px", fontSize: 11, color: "#6366F1", cursor: "pointer",
                fontWeight: 600, whiteSpace: "nowrap", transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EEF2FF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; }}
              >
                Descargar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DEMO MODE — Context-aware assistant responses ────────────────────────────
function getDemoAssistantResponse(userInput, projects, invoices, tickets, documents, recentActions) {
  const q = userInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const pending = invoices.filter(i => i.status !== "Pagada");
  const pendingTotal = pending.reduce((s, i) => s + i.amount, 0);
  const openTickets = tickets.filter(t => t.status !== "Resuelto");
  const activeProjects = projects.filter(p => p.status !== "Completado");
  const lastAction = recentActions.length > 0 ? recentActions[recentActions.length - 1] : null;

  // Context-aware: mention recent actions
  if (q.includes("ultimo") || q.includes("reciente") || q.includes("acabo") || q.includes("hice")) {
    if (lastAction) {
      return `Tu ultima accion fue: ${lastAction}. ¿Necesitas algo mas?`;
    }
    return "No he registrado acciones recientes en esta sesion. ¿En que puedo ayudarte?";
  }

  if (q.includes("proyecto") || q.includes("estado") || q.includes("progreso") || q.includes("avance")) {
    if (q.includes("crm") || q.includes("erp") || q.includes("integracion")) {
      const p = projects.find(x => x.name.toLowerCase().includes("crm")) || projects[1];
      return `El proyecto "${p.name}" esta en fase de **${p.status}** con un avance del ${p.progress}%. Manager: ${p.manager}. Fecha de entrega: ${p.dueDate}. Presupuesto ejercido: ${fmt(p.spent)} de ${fmt(p.budget)}.`;
    }
    if (q.includes("app") || q.includes("movil") || q.includes("flutter")) {
      const p = projects.find(x => x.name.toLowerCase().includes("flutter")) || projects[2];
      return `La "${p.name}" esta en fase de **${p.status}** con ${p.progress}% de avance. Manager: ${p.manager}. La entrega esta programada para ${p.dueDate}. Presupuesto: ${fmt(p.spent)} ejercido de ${fmt(p.budget)}.`;
    }
    if (q.includes("web") || q.includes("corporativo") || q.includes("rediseno")) {
      const p = projects.find(x => x.name.toLowerCase().includes("web")) || projects[0];
      return `El "${p.name}" avanza al ${p.progress}% — esta **${p.status}**. Manager: ${p.manager}. Entrega estimada: ${p.dueDate}. Se ha ejercido ${fmt(p.spent)} del presupuesto de ${fmt(p.budget)}.`;
    }
    if (q.includes("dashboard") || q.includes("analytics")) {
      const p = projects.find(x => x.name.toLowerCase().includes("dashboard")) || projects[3];
      return `El "${p.name}" esta al ${p.progress}% — **${p.status}**. Fue gestionado por ${p.manager}. Presupuesto final: ${fmt(p.spent)} de ${fmt(p.budget)}.`;
    }
    return `Tienes ${activeProjects.length} proyectos activos:\n${projects.map(p => `• **${p.name}**: ${p.status} (${p.progress}%) — entrega ${p.dueDate}`).join("\n")}\n\n¿Quieres mas detalle de alguno en especifico?`;
  }

  if (q.includes("factura") || q.includes("pendiente") || q.includes("cobrar") || q.includes("pago") || q.includes("debo") || q.includes("cuanto")) {
    if (pending.length === 0) {
      return "No tienes facturas pendientes de pago. Todas tus facturas estan al corriente.";
    }
    return `Tienes **${pending.length} facturas pendientes** por un total de **${fmt(pendingTotal)}**:\n${pending.map(i => `• ${i.id}: ${i.concept} — ${fmt(i.amount)} (${i.status}, vence ${i.dueDate})`).join("\n")}\n\n${pending.some(i => i.status === "Vencida") ? "Hay una factura vencida. Te recomiendo regularizarla a la brevedad." : "Todas estan dentro de plazo de pago."}`;
  }

  if (q.includes("ticket") || q.includes("soporte") || q.includes("problema") || q.includes("error") || q.includes("abierto")) {
    if (openTickets.length === 0) {
      return "No tienes tickets abiertos en este momento. Todo el soporte esta al dia.";
    }
    return `Tienes **${openTickets.length} tickets activos**:\n${openTickets.map(t => `• ${t.id}: "${t.title}" — Prioridad ${t.priority}, ${t.status} (${t.project})`).join("\n")}\n\nEl equipo de soporte esta trabajando en ellos. ¿Necesitas escalar alguno?`;
  }

  if (q.includes("documento") || q.includes("archivo") || q.includes("contrato") || q.includes("propuesta")) {
    return `Tienes ${documents.length} documentos en tu portal:\n${documents.map(d => `• ${d.name} (${d.size}) — ${d.project}`).join("\n")}\n\nPuedes descargarlos desde la seccion de Documentos.`;
  }

  if (q.includes("presupuesto") || q.includes("gasto") || q.includes("costo") || q.includes("inversion")) {
    const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
    const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
    return `Resumen de inversion:\n• Presupuesto total: **${fmt(totalBudget)}**\n• Ejercido: **${fmt(totalSpent)}** (${Math.round(totalSpent / totalBudget * 100)}%)\n• Disponible: **${fmt(totalBudget - totalSpent)}**\n\nEl proyecto con mayor ejecucion presupuestal es "${[...projects].sort((a, b) => (b.spent / b.budget) - (a.spent / a.budget))[0].name}".`;
  }

  if (q.includes("hola") || q.includes("hey") || q.includes("buenos") || q.includes("buenas")) {
    return `Hola! Bienvenido al portal de ${CURRENT_USER.name}. Tienes ${activeProjects.length} proyectos activos, ${pending.length} facturas pendientes (${fmt(pendingTotal)}) y ${openTickets.length} tickets abiertos. ¿En que puedo ayudarte hoy?`;
  }

  if (q.includes("ayuda") || q.includes("que puedes") || q.includes("como funciona")) {
    return "Puedo ayudarte con:\n• **Estado de proyectos** — avance, fechas, presupuesto\n• **Facturas** — pendientes, montos, vencimientos\n• **Tickets de soporte** — estado, prioridad\n• **Documentos** — contratos, propuestas\n• **Resumen general** de tu cuenta\n\nSolo preguntame lo que necesites.";
  }

  return `Segun tu cuenta (${CURRENT_USER.name}, Plan ${CURRENT_USER.plan}):\n• ${activeProjects.length} proyectos activos\n• ${fmt(pendingTotal)} en facturas pendientes\n• ${openTickets.length} tickets de soporte abiertos\n\nPuedes preguntarme sobre el estado de tus proyectos, facturas pendientes, tickets o documentos. ¿Como te ayudo?`;
}

// ─── QUICK SUGGESTION CHIPS ──────────────────────────────────────────────────
const SUGGESTION_CHIPS = [
  "Estado de mis proyectos",
  "Facturas pendientes",
  "Tickets abiertos",
  "Resumen de presupuesto",
];

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AIAssistant({ onClose, projects, invoices, tickets, documents, recentActions }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hola! Soy tu asistente IA integrado al portal. Puedo ayudarte a revisar el estado de tus proyectos, facturas pendientes, tickets abiertos o cualquier duda sobre tu cuenta. ¿En que te ayudo?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const send = async (overrideInput) => {
    const msgText = overrideInput || input;
    if (!msgText.trim() || loading) return;
    const userMsg = { role: "user", content: msgText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    const response = getDemoAssistantResponse(msgText, projects, invoices, tickets, documents, recentActions);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat limpiado. ¿En que puedo ayudarte?",
    }]);
    setInput("");
  };

  const showChips = messages.length <= 2 && !loading;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      width: 380, background: "#fff",
      border: "1px solid #E2E8F0", borderRadius: 18,
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      overflow: "hidden", animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }`}</style>
      <div style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&#10022;</div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Asistente IA</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Powered by Claude</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {messages.length > 1 && (
            <button onClick={clearChat} title="Limpiar chat" style={{
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6,
              width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            >
              &#8634;
            </button>
          )}
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14, transition: "background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          >
            &#10005;
          </button>
        </div>
      </div>
      <div ref={chatContainerRef} style={{ height: 280, overflowY: "auto", padding: "14px 16px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8 }}>
            <div style={{
              maxWidth: "82%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? "#6366F1" : "#F8FAFC",
              border: m.role === "user" ? "none" : "1px solid #E2E8F0",
              fontSize: 12, lineHeight: 1.65,
              color: m.role === "user" ? "#fff" : "#334155",
              overflowWrap: "break-word", wordBreak: "break-word",
              maxHeight: 200, overflowY: "auto", whiteSpace: "pre-line",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
            <div style={{
              maxWidth: "82%", padding: "9px 13px", borderRadius: "14px 14px 14px 4px",
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>Escribiendo</span>
              <span style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366F1", display: "inline-block", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      {showChips && (
        <div style={{ padding: "0 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUGGESTION_CHIPS.map((chip, i) => (
            <button key={i} onClick={() => send(chip)} style={{
              padding: "5px 11px", borderRadius: 16,
              background: "#EEF2FF", border: "1px solid #C7D2FE",
              fontSize: 11, color: "#4F46E5", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C7D2FE"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#EEF2FF"; }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "10px 14px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
          placeholder="Escribe tu pregunta..."
          style={{
            flex: 1, border: "1px solid #E2E8F0", borderRadius: 8,
            padding: "8px 12px", fontSize: 12, color: "#334155",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} style={{
          background: input.trim() && !loading ? "#6366F1" : "#F1F5F9",
          border: "none", borderRadius: 8, width: 34, height: 34,
          cursor: input.trim() && !loading ? "pointer" : "default",
          color: input.trim() && !loading ? "#fff" : "#CBD5E1",
          fontSize: 14, transition: "all 0.15s",
        }}>&#8593;</button>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
function ContactBar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('cta-dismissed')) return;
    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, []);
  if (dismissed || !show) return null;
  const dismiss = () => { setDismissed(true); sessionStorage.setItem('cta-dismissed', '1'); };
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: 'rgba(10,11,15,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(99,102,241,0.2)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', animation: 'slideUpCTA 0.4s ease', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes slideUpCTA { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <span style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 500 }}>Esto es una demo gratuita de Impulso IA 👋 ¿Quieres algo así para tu negocio?</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <a href="https://impulso-ia-navy.vercel.app/#contacto" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s' }}>Platiquemos</a>
        <a href="https://wa.me/525579605324?text=Hola%20Christian%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20tus%20servicios%20de%20IA" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>WhatsApp</a>
        <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 18, cursor: 'pointer', padding: '4px 8px' }}>✕</button>
      </div>
    </div>
  );
}

export default function ClientPortal() {
  const [activeSection, setActiveSection] = useState("proyectos");
  const [showAI, setShowAI] = useState(false);
  const [visitedSections, setVisitedSections] = useState({ proyectos: true });

  // ── Live state ──
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [recentActions, setRecentActions] = useState([]);

  // ── Toast system ──
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const logAction = useCallback((text) => {
    setRecentActions(prev => [...prev.slice(-19), text]);
  }, []);

  // ── New Ticket Modal ──
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketProject, setTicketProject] = useState(INITIAL_PROJECTS[0].name);
  const [ticketPriority, setTicketPriority] = useState("Media");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketError, setTicketError] = useState("");

  // ── New Invoice Modal ──
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [invConcept, setInvConcept] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invDueDate, setInvDueDate] = useState("");
  const [invError, setInvError] = useState("");

  // ── Ticket next ID ──
  const ticketCounter = useRef(42);
  const invoiceCounter = useRef(39);

  const switchSection = (id) => {
    setActiveSection(id);
    setVisitedSections(prev => ({ ...prev, [id]: true }));
  };

  // ── Handlers ──
  const handleSubmitTicket = () => {
    if (!ticketTitle.trim() || ticketTitle.trim().length < 5) {
      setTicketError("El titulo es obligatorio y debe tener al menos 5 caracteres");
      return;
    }
    const newId = `TKT-${String(ticketCounter.current++).padStart(4, "0")}`;
    const newTicket = {
      id: newId,
      title: ticketTitle.trim(),
      priority: ticketPriority,
      status: "Abierto",
      created: todayStr(),
      project: ticketProject,
      description: ticketDesc,
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketError("");
    setShowNewTicket(false);
    setTicketTitle("");
    setTicketProject(projects[0]?.name || "");
    setTicketPriority("Media");
    setTicketDesc("");
    addToast(`Ticket ${newId} creado: "${newTicket.title}"`, "success");
    logAction(`Creaste el ticket ${newId}: "${newTicket.title}" (${ticketPriority}, ${ticketProject})`);
  };

  const handleChangeTicketStatus = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const idx = TICKET_STATUS_FLOW.indexOf(t.status);
      if (idx < 0 || idx >= TICKET_STATUS_FLOW.length - 1) return t;
      const newStatus = TICKET_STATUS_FLOW[idx + 1];
      addToast(`Ticket ${t.id} cambiado a "${newStatus}"`, "info");
      logAction(`Cambiaste el ticket ${t.id} de "${t.status}" a "${newStatus}"`);
      return { ...t, status: newStatus };
    }));
  };

  const handleMarkInvoicePaid = (invoiceId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      addToast(`Factura ${inv.id} marcada como pagada (${fmt(inv.amount)})`, "success");
      logAction(`Marcaste la factura ${inv.id} como pagada — ${fmt(inv.amount)}`);
      return { ...inv, status: "Pagada" };
    }));
  };

  const handleSubmitInvoice = () => {
    if (!invConcept.trim()) {
      setInvError("El concepto es obligatorio");
      return;
    }
    const amount = parseFloat(invAmount);
    if (!amount || amount <= 0) {
      setInvError("Ingresa un monto valido mayor a 0");
      return;
    }
    if (!invDueDate) {
      setInvError("La fecha de vencimiento es obligatoria");
      return;
    }
    const newId = `FAC-2026-${String(invoiceCounter.current++).padStart(3, "0")}`;
    const newInv = {
      id: newId,
      date: todayStr(),
      concept: invConcept.trim(),
      amount,
      status: "Pendiente",
      dueDate: invDueDate,
    };
    setInvoices(prev => [newInv, ...prev]);
    setInvError("");
    setShowNewInvoice(false);
    setInvConcept("");
    setInvAmount("");
    setInvDueDate("");
    addToast(`Factura ${newId} creada por ${fmt(amount)}`, "success");
    logAction(`Creaste la factura ${newId}: "${invConcept.trim()}" por ${fmt(amount)}`);
  };

  const handleUpdateProgress = (projectId, newProgress) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const logEntry = { text: `Progreso actualizado a ${newProgress}%`, ts: Date.now() };
      addToast(`"${p.name}" actualizado a ${newProgress}%`, "info");
      logAction(`Actualizaste el progreso de "${p.name}" de ${p.progress}% a ${newProgress}%`);
      return { ...p, progress: newProgress, log: [...p.log, logEntry] };
    }));
  };

  const handleUploadDocument = (fileInfo) => {
    const newDoc = {
      id: documents.length + 1 + Date.now(),
      name: fileInfo.name,
      type: fileInfo.type,
      size: fileInfo.size,
      date: todayStr(),
      project: fileInfo.project,
    };
    setDocuments(prev => [newDoc, ...prev]);
    addToast(`Documento "${fileInfo.name}" subido`, "success");
    logAction(`Subiste el documento "${fileInfo.name}" (${fileInfo.size})`);
  };

  // ── Nav counts (live) ──
  const NAV = [
    { id: "proyectos", label: "Proyectos", icon: "\u25C8", count: projects.filter(p => p.status !== "Completado").length },
    { id: "facturas",  label: "Facturas",  icon: "\u25CE", count: invoices.filter(i => i.status !== "Pagada").length },
    { id: "tickets",   label: "Soporte",   icon: "\u25C9", count: tickets.filter(t => t.status === "Abierto").length },
    { id: "documentos",label: "Documentos",icon: "\u25EB", count: null },
  ];

  const SECTION_TITLES = { proyectos: "Mis Proyectos", facturas: "Facturacion", tickets: "Soporte & Tickets", documentos: "Documentos" };

  return (
    <>
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px) } to { opacity:1; transform:translateX(0) } }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        textarea:focus { outline: none; }
        select:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }
        button { font-family: 'DM Sans', sans-serif; }
        input[type="range"] { height: 6px; }
      `}</style>

      {/* TOASTS */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* SIDEBAR */}
      <div style={{
        width: 240, background: "#fff",
        borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
        padding: "24px 0", position: "fixed",
        top: 0, left: 0, bottom: 0, zIndex: 10,
        transition: "box-shadow 0.3s",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #F1F5F9" }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.04em" }}>
            client<span style={{ color: "#6366F1" }}>hub</span>
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Portal de Clientes
          </p>
        </div>

        {/* User */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#fff",
            }}>
              {CURRENT_USER.avatar}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{CURRENT_USER.name}</p>
              <span style={{ fontSize: 10, background: "#EEF2FF", color: "#6366F1", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>
                Plan {CURRENT_USER.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px" }}>
          {NAV.map(item => {
            const isActive = activeSection === item.id;
            const hasUnvisited = !visitedSections[item.id] && item.count > 0;
            return (
              <button key={item.id} onClick={() => switchSection(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                background: isActive ? "#EEF2FF" : "transparent",
                border: "none", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, color: isActive ? "#6366F1" : "#94A3B8", transition: "color 0.2s" }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#6366F1" : "#64748B", transition: "all 0.2s" }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {hasUnvisited && (
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "#EF4444", display: "inline-block",
                      animation: "bounce 2s ease-in-out infinite",
                    }} />
                  )}
                  {item.count > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "1px 7px",
                      background: isActive ? "#6366F1" : "#F1F5F9",
                      color: isActive ? "#fff" : "#64748B",
                      borderRadius: 10,
                      transition: "all 0.2s",
                    }}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* AI Button */}
        <div style={{ padding: "12px 12px 0" }}>
          <button onClick={() => setShowAI(v => !v)} style={{
            width: "100%", padding: "11px 14px",
            background: showAI ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "#F8FAFC",
            border: `1px solid ${showAI ? "transparent" : "#E2E8F0"}`,
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
            boxShadow: showAI ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
          }}
            onMouseEnter={e => { if (!showAI) e.currentTarget.style.background = "#EEF2FF"; }}
            onMouseLeave={e => { if (!showAI) e.currentTarget.style.background = "#F8FAFC"; }}
          >
            <span style={{ fontSize: 16 }}>&#10022;</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: showAI ? "#fff" : "#6366F1" }}>
              Asistente IA
            </span>
            <span style={{ marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 4, background: showAI ? "rgba(255,255,255,0.2)" : "#EEF2FF", color: showAI ? "#fff" : "#6366F1", fontWeight: 700 }}>
              CLAUDE
            </span>
          </button>
        </div>

        <p style={{ margin: "12px 20px 0", fontSize: 9, color: "#CBD5E1", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Built with Softr + Airtable + Claude API
        </p>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: 240, flex: 1, padding: "28px 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>
              {SECTION_TITLES[activeSection]}
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>
              Bienvenido, {CURRENT_USER.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, color: "#64748B", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 14px" }}>
              {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Content with transition */}
        <div style={{ animation: "slideIn 0.35s ease" }} key={activeSection}>
          {activeSection === "proyectos"  && <ProjectsView projects={projects} onUpdateProgress={handleUpdateProgress} />}
          {activeSection === "facturas"   && <InvoicesView invoices={invoices} onMarkPaid={handleMarkInvoicePaid} onNewInvoice={() => setShowNewInvoice(true)} />}
          {activeSection === "tickets"    && <TicketsView tickets={tickets} onNewTicket={() => setShowNewTicket(true)} onChangeStatus={handleChangeTicketStatus} />}
          {activeSection === "documentos" && <DocumentsView documents={documents} onUpload={handleUploadDocument} />}
        </div>
      </div>

      {/* AI Assistant */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} projects={projects} invoices={invoices} tickets={tickets} documents={documents} recentActions={recentActions} />}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => { setShowNewTicket(false); setTicketError(""); }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 18, padding: 28,
            width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s ease",
          }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Nuevo Ticket de Soporte</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Titulo del problema *
              </label>
              <input
                value={ticketTitle}
                onChange={e => { setTicketTitle(e.target.value); setTicketError(""); }}
                style={{
                  width: "100%", border: `1px solid ${ticketError ? "#EF4444" : "#E2E8F0"}`,
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                  transition: "border-color 0.2s",
                }}
                placeholder="Minimo 5 caracteres"
              />
              {ticketError && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{ticketError}</p>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Proyecto relacionado
              </label>
              <select
                value={ticketProject}
                onChange={e => setTicketProject(e.target.value)}
                style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155", background: "#fff", cursor: "pointer" }}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Prioridad
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Alta", "Media", "Baja"].map(pr => (
                  <button key={pr} onClick={() => setTicketPriority(pr)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                    border: ticketPriority === pr ? `2px solid ${PRIORITY[pr]}` : "1px solid #E2E8F0",
                    background: ticketPriority === pr ? (pr === "Alta" ? "#FEF2F2" : pr === "Media" ? "#FFFBEB" : "#F0FDF4") : "#fff",
                    color: PRIORITY[pr],
                    transition: "all 0.15s",
                  }}>
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Descripcion detallada
              </label>
              <textarea
                value={ticketDesc}
                onChange={e => setTicketDesc(e.target.value)}
                rows={3}
                style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155", resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => { setShowNewTicket(false); setTicketError(""); }} style={{
                padding: "9px 18px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff",
                fontSize: 13, cursor: "pointer", color: "#64748B", transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
              >
                Cancelar
              </button>
              <button onClick={handleSubmitTicket} style={{
                padding: "9px 18px", border: "none", borderRadius: 8, background: "#6366F1",
                fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Enviar Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {showNewInvoice && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => { setShowNewInvoice(false); setInvError(""); }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 18, padding: 28,
            width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s ease",
          }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Nueva Factura</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Concepto *
              </label>
              <input
                value={invConcept}
                onChange={e => { setInvConcept(e.target.value); setInvError(""); }}
                style={{
                  width: "100%", border: `1px solid ${invError && !invConcept.trim() ? "#EF4444" : "#E2E8F0"}`,
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                }}
                placeholder="Ej: Desarrollo Sprint 7"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Monto (MXN) *
              </label>
              <input
                type="number"
                value={invAmount}
                onChange={e => { setInvAmount(e.target.value); setInvError(""); }}
                style={{
                  width: "100%", border: "1px solid #E2E8F0",
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                }}
                placeholder="Ej: 25000"
                min="0"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Fecha de vencimiento *
              </label>
              <input
                type="date"
                value={invDueDate}
                onChange={e => { setInvDueDate(e.target.value); setInvError(""); }}
                style={{
                  width: "100%", border: "1px solid #E2E8F0",
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                }}
              />
            </div>

            {invError && (
              <p style={{ margin: "0 0 10px", fontSize: 11, color: "#EF4444" }}>{invError}</p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => { setShowNewInvoice(false); setInvError(""); }} style={{
                padding: "9px 18px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff",
                fontSize: 13, cursor: "pointer", color: "#64748B", transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
              >
                Cancelar
              </button>
              <button onClick={handleSubmitInvoice} style={{
                padding: "9px 18px", border: "none", borderRadius: 8, background: "#6366F1",
                fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Crear Factura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <ContactBar />
    </>
  );
}
