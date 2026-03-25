import { useState, useRef, useEffect, useCallback } from "react";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  // Sidebar
  portalSubtitle:    { es: "Portal de Clientes",   en: "Client Portal" },
  plan:              { es: "Plan",                  en: "Plan" },
  aiAssistant:       { es: "Asistente IA",          en: "AI Assistant" },
  builtWith:         { es: "Built with Softr + Airtable + Claude API", en: "Built with Softr + Airtable + Claude API" },

  // Nav
  navProjects:       { es: "Proyectos",   en: "Projects" },
  navInvoices:       { es: "Facturas",    en: "Invoices" },
  navSupport:        { es: "Soporte",     en: "Support" },
  navDocuments:      { es: "Documentos",  en: "Documents" },

  // Section titles
  titleProjects:     { es: "Mis Proyectos",        en: "My Projects" },
  titleInvoices:     { es: "Facturacion",           en: "Billing" },
  titleTickets:      { es: "Soporte & Tickets",     en: "Support & Tickets" },
  titleDocuments:    { es: "Documentos",            en: "Documents" },

  // Header
  welcome:           { es: "Bienvenido,",           en: "Welcome," },

  // Projects
  pm:                { es: "PM:",                   en: "PM:" },
  delivery:          { es: "Entrega",               en: "Due" },
  progress:          { es: "Progreso",              en: "Progress" },
  edit:              { es: "Editar",                en: "Edit" },
  budget:            { es: "Presupuesto",           en: "Budget" },
  spent:             { es: "Ejercido",              en: "Spent" },

  // Invoices
  newInvoice:        { es: "+ Nueva Factura",       en: "+ New Invoice" },
  totalBilled:       { es: "Total Facturado",       en: "Total Billed" },
  outstanding:       { es: "Por Cobrar",            en: "Outstanding" },
  invoicesCount:     { es: "Facturas",              en: "Invoices" },
  pending:           { es: "PENDIENTE",             en: "PENDING" },
  invoiceNo:         { es: "No. Factura",           en: "Invoice No." },
  concept:           { es: "Concepto",              en: "Concept" },
  amount:            { es: "Monto",                 en: "Amount" },
  dueDate:           { es: "Vencimiento",           en: "Due Date" },
  status:            { es: "Estado",                en: "Status" },
  action:            { es: "Accion",                en: "Action" },
  markPaid:          { es: "Marcar pagada",         en: "Mark paid" },

  // Tickets
  newTicket:         { es: "+ Nuevo Ticket",        en: "+ New Ticket" },
  start:             { es: "Iniciar",               en: "Start" },
  resolve:           { es: "Resolver",              en: "Resolve" },
  closed:            { es: "Cerrado",               en: "Closed" },

  // Documents
  uploadDoc:         { es: "+ Subir Documento",     en: "+ Upload Document" },
  download:          { es: "Descargar",             en: "Download" },

  // Statuses (display labels)
  statusInProgress:  { es: "En progreso",     en: "In Progress" },
  statusReview:      { es: "Revision",         en: "Review" },
  statusPlanning:    { es: "Planificacion",    en: "Planning" },
  statusCompleted:   { es: "Completado",       en: "Completed" },
  statusPaid:        { es: "Pagada",           en: "Paid" },
  statusPending:     { es: "Pendiente",        en: "Pending" },
  statusOverdue:     { es: "Vencida",          en: "Overdue" },
  statusOpen:        { es: "Abierto",          en: "Open" },
  statusInProgressT: { es: "En progreso",      en: "In Progress" },
  statusResolved:    { es: "Resuelto",         en: "Resolved" },

  // Priorities
  prioHigh:          { es: "Alta",   en: "High" },
  prioMedium:        { es: "Media",  en: "Medium" },
  prioLow:           { es: "Baja",   en: "Low" },

  // AI Assistant
  aiTitle:           { es: "Asistente IA",     en: "AI Assistant" },
  aiPowered:         { es: "Powered by Claude", en: "Powered by Claude" },
  cleanChat:         { es: "Limpiar chat",      en: "Clear chat" },
  typing:            { es: "Escribiendo",       en: "Typing" },
  chatPlaceholder:   { es: "Escribe tu pregunta...", en: "Type your question..." },
  chatCleared:       { es: "Chat limpiado. ¿En que puedo ayudarte?", en: "Chat cleared. How can I help you?" },
  aiWelcome:         { es: "Hola! Soy tu asistente IA integrado al portal. Puedo ayudarte a revisar el estado de tus proyectos, facturas pendientes, tickets abiertos o cualquier duda sobre tu cuenta. ¿En que te ayudo?", en: "Hi! I'm your AI assistant integrated into the portal. I can help you review your project status, pending invoices, open tickets, or any questions about your account. How can I help?" },
  chipProjects:      { es: "Estado de mis proyectos",  en: "My project status" },
  chipInvoices:      { es: "Facturas pendientes",      en: "Pending invoices" },
  chipTickets:       { es: "Tickets abiertos",          en: "Open tickets" },
  chipBudget:        { es: "Resumen de presupuesto",    en: "Budget summary" },

  // New Ticket Modal
  newTicketTitle:    { es: "Nuevo Ticket de Soporte",  en: "New Support Ticket" },
  ticketTitleLabel:  { es: "Titulo del problema *",    en: "Issue title *" },
  ticketMinChars:    { es: "Minimo 5 caracteres",      en: "Minimum 5 characters" },
  ticketTitleError:  { es: "El titulo es obligatorio y debe tener al menos 5 caracteres", en: "Title is required and must be at least 5 characters" },
  relatedProject:    { es: "Proyecto relacionado",     en: "Related project" },
  priority:          { es: "Prioridad",                en: "Priority" },
  detailedDesc:      { es: "Descripcion detallada",    en: "Detailed description" },
  cancel:            { es: "Cancelar",                 en: "Cancel" },
  submitTicket:      { es: "Enviar Ticket",            en: "Submit Ticket" },

  // New Invoice Modal
  newInvoiceTitle:   { es: "Nueva Factura",            en: "New Invoice" },
  conceptLabel:      { es: "Concepto *",               en: "Concept *" },
  conceptPlaceholder:{ es: "Ej: Desarrollo Sprint 7",  en: "E.g.: Development Sprint 7" },
  amountLabel:       { es: "Monto (MXN) *",            en: "Amount (MXN) *" },
  amountPlaceholder: { es: "Ej: 25000",                en: "E.g.: 25000" },
  dueDateLabel:      { es: "Fecha de vencimiento *",   en: "Due date *" },
  conceptRequired:   { es: "El concepto es obligatorio", en: "Concept is required" },
  amountInvalid:     { es: "Ingresa un monto valido mayor a 0", en: "Enter a valid amount greater than 0" },
  dueDateRequired:   { es: "La fecha de vencimiento es obligatoria", en: "Due date is required" },
  createInvoice:     { es: "Crear Factura",            en: "Create Invoice" },

  // Toasts
  toastTicketCreated:   { es: (id, title) => `Ticket ${id} creado: "${title}"`, en: (id, title) => `Ticket ${id} created: "${title}"` },
  toastTicketChanged:   { es: (id, status) => `Ticket ${id} cambiado a "${status}"`, en: (id, status) => `Ticket ${id} changed to "${status}"` },
  toastInvoicePaid:     { es: (id, amt) => `Factura ${id} marcada como pagada (${amt})`, en: (id, amt) => `Invoice ${id} marked as paid (${amt})` },
  toastProjectUpdated:  { es: (name, pct) => `"${name}" actualizado a ${pct}%`, en: (name, pct) => `"${name}" updated to ${pct}%` },
  toastDocUploaded:     { es: (name) => `Documento "${name}" subido`, en: (name) => `Document "${name}" uploaded` },
  toastInvoiceCreated:  { es: (id, amt) => `Factura ${id} creada por ${amt}`, en: (id, amt) => `Invoice ${id} created for ${amt}` },

  // Contact bar
  ctaText:           { es: "Esto es una demo gratuita de Impulso IA. ¿Quieres algo asi para tu negocio?", en: "This is a free Impulso IA demo. Want something like this for your business?" },
  ctaTalk:           { es: "Platiquemos",  en: "Let's talk" },

  // timeAgo
  justNow:           { es: "hace un momento", en: "just now" },
  minsAgo:           { es: (m) => `hace ${m} min`, en: (m) => `${m} min ago` },
  hoursAgo:          { es: (h) => `hace ${h}h`, en: (h) => `${h}h ago` },
  daysAgo:           { es: (d) => `hace ${d}d`, en: (d) => `${d}d ago` },

  // Dashboard
  navDashboard:      { es: "Dashboard",       en: "Dashboard" },
  titleDashboard:    { es: "Dashboard",        en: "Dashboard" },
  kpiActiveProjects: { es: "Proyectos Activos", en: "Active Projects" },
  kpiPendingInvoices:{ es: "Facturas Pendientes", en: "Pending Invoices" },
  kpiOpenTickets:    { es: "Tickets Abiertos",  en: "Open Tickets" },
  kpiDocuments:      { es: "Documentos",        en: "Documents" },
  recentActivity:    { es: "Actividad Reciente", en: "Recent Activity" },
  projectOverview:   { es: "Resumen de Proyectos", en: "Project Overview" },
  noRecentActivity:  { es: "Sin actividad reciente", en: "No recent activity" },

  // Notification center
  notifications:     { es: "Notificaciones",   en: "Notifications" },
  markAllRead:       { es: "Marcar todo leido", en: "Mark all read" },
  noNotifications:   { es: "Sin notificaciones", en: "No notifications" },
  notifOverdueInv:   { es: (id) => `Factura ${id} esta vencida`, en: (id) => `Invoice ${id} is overdue` },
  notifHighTicket:   { es: (id) => `Ticket ${id} de alta prioridad abierto`, en: (id) => `High priority ticket ${id} is open` },
  notifMilestone:    { es: (name, pct) => `"${name}" alcanzo ${pct}%`, en: (name, pct) => `"${name}" reached ${pct}%` },

  // Ticket comments
  addComment:        { es: "Agregar comentario", en: "Add comment" },
  commentPlaceholder:{ es: "Escribe un comentario...", en: "Write a comment..." },
  assignTo:          { es: "Asignado a",        en: "Assigned to" },
  backToList:        { es: "Volver a lista",    en: "Back to list" },

  // Document filters
  allProjects:       { es: "Todos los proyectos", en: "All projects" },
  allTypes:          { es: "Todos los tipos",     en: "All types" },
  sortByDate:        { es: "Mas reciente",        en: "Most recent" },
  sortByName:        { es: "Nombre A-Z",          en: "Name A-Z" },
  sortBySize:        { es: "Tamano",              en: "Size" },

  // API Key / Mode
  apiKeyLabel:       { es: "Claude API Key",    en: "Claude API Key" },
  aiMode:            { es: "Modo IA",           en: "AI Mode" },
  demoMode:          { es: "Modo Demo",         en: "Demo Mode" },
  resetData:         { es: "Restaurar datos demo", en: "Reset Demo Data" },

  // AI badge
  aiBadge:           { es: "IA",               en: "AI" },
  demoBadge:         { es: "DEMO",             en: "DEMO" },

  // Onboarding Tour
  tourWelcomeTitle:  { es: "ClientHub — Portal de Clientes con IA", en: "ClientHub — AI Client Portal" },
  tourWelcomeText:   { es: "Un portal completo para clientes con seguimiento de proyectos, facturas, tickets de soporte, gestion de documentos, y asistente IA. Gestiona todo lo que tus clientes necesitan en un solo lugar.\n\n\u00a1Dejame guiarte!", en: "A complete client portal with project tracking, invoices, support tickets, document management, and an AI assistant. Manage everything your clients need in one place.\n\nLet me walk you through it!" },
  tourStartBtn:      { es: "Comenzar Tour \u2192", en: "Start Tour \u2192" },
  tourSkip:          { es: "Saltar Tour",      en: "Skip Tour" },
  tourNext:          { es: "Siguiente \u2192",       en: "Next \u2192" },
  tourTryIt:         { es: "Probar \u2192",          en: "Try it \u2192" },
  tourFinish:        { es: "Finalizar Tour \u2713",  en: "Finish Tour \u2713" },
  tourStepOf:        { es: (c, t) => `Paso ${c} de ${t}`, en: (c, t) => `Step ${c} of ${t}` },
  tourLangSelect:    { es: "Selecciona idioma:",     en: "Select language:" },

  tourDashboardTitle:{ es: "Dashboard y KPIs",       en: "Dashboard & KPIs" },
  tourDashboardText: { es: "Aqui ves el resumen ejecutivo: proyectos activos, facturas pendientes, tickets abiertos y documentos. Todo en tiempo real.", en: "Here you see the executive summary: active projects, pending invoices, open tickets, and documents. All in real time." },

  tourNotifTitle:    { es: "Centro de Notificaciones", en: "Notification Center" },
  tourNotifText:     { es: "La campana muestra alertas importantes: facturas vencidas, tickets urgentes y milestones de proyectos.", en: "The bell shows important alerts: overdue invoices, urgent tickets, and project milestones." },

  tourProjectsTitle: { es: "Proyectos",               en: "Projects" },
  tourProjectsText:  { es: "Cada tarjeta muestra el estado, progreso, presupuesto y equipo asignado. Puedes editar el progreso directamente.", en: "Each card shows status, progress, budget, and assigned team. You can edit progress directly." },

  tourInvoicesTitle: { es: "Facturacion",              en: "Billing" },
  tourInvoicesText:  { es: "Vista completa de facturas con totales, estados y acciones. Marca facturas como pagadas con un clic.", en: "Complete invoice view with totals, statuses, and actions. Mark invoices as paid with one click." },

  tourInvoicePaidTitle: { es: "Marcar como Pagada",    en: "Mark as Paid" },
  tourInvoicePaidText:  { es: "Observa como se actualiza el estado de la factura automaticamente.", en: "Watch how the invoice status updates automatically." },

  tourTicketsTitle:  { es: "Soporte y Tickets",        en: "Support & Tickets" },
  tourTicketsText:   { es: "Sistema completo de tickets con prioridades, estados y asignaciones. Cada ticket tiene su propio hilo de comentarios.", en: "Complete ticket system with priorities, statuses, and assignments. Each ticket has its own comment thread." },

  tourCreateTicketTitle: { es: "Crear Ticket",         en: "Create Ticket" },
  tourCreateTicketText:  { es: "Vamos a crear un ticket de prueba automaticamente para que veas el flujo completo.", en: "Let's auto-create a test ticket so you can see the full workflow." },

  tourDocsTitle:     { es: "Documentos",               en: "Documents" },
  tourDocsText:      { es: "Gestion de documentos con filtros por proyecto, tipo y ordenamiento. Soporta subida de archivos.", en: "Document management with filters by project, type, and sorting. Supports file uploads." },

  tourAITitle:       { es: "Asistente IA",             en: "AI Assistant" },
  tourAIText:        { es: "El asistente IA integrado puede consultar datos reales del portal: proyectos, facturas, tickets y mas. Veamoslo en accion.", en: "The integrated AI assistant can query real portal data: projects, invoices, tickets, and more. Let's see it in action." },

  tourFinishTitle:   { es: "\u00a1Tour Completado!",         en: "Tour Complete!" },
  tourFinishText:    { es: "Ya conoces todas las funciones de ClientHub. Explora libremente, usa el asistente IA, y prueba todas las interacciones. \u00a1Todo es funcional!", en: "You now know all of ClientHub's features. Explore freely, use the AI assistant, and try all interactions. Everything is functional!" },
};

// Status key-to-translation-key map (internal status values -> T keys)
const STATUS_KEY_MAP = {
  "En progreso": "statusInProgress",
  "Revisión":    "statusReview",
  "Planificación": "statusPlanning",
  "Completado":  "statusCompleted",
  "Pagada":      "statusPaid",
  "Pendiente":   "statusPending",
  "Vencida":     "statusOverdue",
  "Abierto":     "statusOpen",
  "Resuelto":    "statusResolved",
};

const PRIORITY_KEY_MAP = {
  "Alta":  "prioHigh",
  "Media": "prioMedium",
  "Baja":  "prioLow",
};

// Helper: translate a status value
const tStatus = (status, lang) => {
  const key = STATUS_KEY_MAP[status];
  return key ? T[key][lang] : status;
};

const tPriority = (prio, lang) => {
  const key = PRIORITY_KEY_MAP[prio];
  return key ? T[key][lang] : prio;
};

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
  { id: "TKT-0041", title: "Error al exportar reportes PDF", priority: "Alta", status: "Abierto", created: "2026-03-18", createdTs: Date.now() - 6 * 24 * 3600000, project: "Dashboard Analytics", description: "", assignee: "Ana Lopez", comments: [{ author: "Ana Lopez", text: "Revisando el modulo de exportacion.", ts: Date.now() - 5 * 24 * 3600000 }] },
  { id: "TKT-0039", title: "Ajuste de colores en dashboard móvil", priority: "Baja", status: "En progreso", created: "2026-03-15", createdTs: Date.now() - 9 * 24 * 3600000, project: "App Móvil Flutter", description: "", assignee: "Sofia Castro", comments: [] },
  { id: "TKT-0037", title: "Configurar webhook de pagos Stripe", priority: "Media", status: "Resuelto", created: "2026-03-10", createdTs: Date.now() - 14 * 24 * 3600000, project: "Integración CRM + ERP", description: "", assignee: "Carlos Vega", comments: [{ author: "Carlos Vega", text: "Webhook configurado y probado.", ts: Date.now() - 12 * 24 * 3600000 }] },
  { id: "TKT-0035", title: "Optimizar velocidad de carga home page", priority: "Media", status: "Resuelto", created: "2026-03-05", createdTs: Date.now() - 19 * 24 * 3600000, project: "Rediseño Web Corporativo", description: "", assignee: "Miguel Torres", comments: [] },
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

const timeAgo = (ts, lang = "es") => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return T.justNow[lang];
  if (mins < 60) return T.minsAgo[lang](mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return T.hoursAgo[lang](hrs);
  return T.daysAgo[lang](Math.floor(hrs / 24));
};

// ─── LOCALSTORAGE PERSISTENCE ─────────────────────────────────────────────────
const LS_KEYS = { projects: 'ch_projects', invoices: 'ch_invoices', tickets: 'ch_tickets', documents: 'ch_documents', actions: 'ch_actions', apiKey: 'ch_claude_key' };

const lsGet = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const lsSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
};

// ─── CLAUDE API INTEGRATION ──────────────────────────────────────────────────
// ─── CLAUDE TOOL USE DEFINITIONS ────────────────────────────────────────────
const TOOLS = [
  {
    name: "query_projects",
    description: "Get project details including status, progress percentage, budget, spent amount, manager, and due date. Can optionally filter by status.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status: 'En progreso', 'Revisión', 'Planificación', 'Completado'. Leave empty for all." }
      },
      required: []
    }
  },
  {
    name: "query_invoices",
    description: "Get invoice data including amounts, status, due dates, and concepts. Can optionally filter by status.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status: 'Pagada', 'Pendiente', 'Vencida'. Leave empty for all." }
      },
      required: []
    }
  },
  {
    name: "query_tickets",
    description: "Get support tickets including priority, status, assignee, and related project. Can filter by priority or status.",
    input_schema: {
      type: "object",
      properties: {
        priority: { type: "string", description: "Filter by priority: 'Alta', 'Media', 'Baja'. Leave empty for all." },
        status: { type: "string", description: "Filter by status: 'Abierto', 'En progreso', 'Resuelto'. Leave empty for all." }
      },
      required: []
    }
  },
  {
    name: "query_documents",
    description: "List documents including type, associated project, upload date, and file size.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "create_ticket",
    description: "Create a new support ticket with a title, priority, and description.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the support ticket" },
        priority: { type: "string", enum: ["Alta", "Media", "Baja"], description: "Priority level" },
        description: { type: "string", description: "Detailed description of the issue" }
      },
      required: ["title", "priority"]
    }
  },
  {
    name: "get_dashboard_summary",
    description: "Get a KPI summary of the portal: active projects count, pending invoices total, open tickets count, and document count.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

function executeClientTool(toolName, toolInput, projects, invoices, tickets, documents) {
  switch (toolName) {
    case "query_projects": {
      let data = projects;
      if (toolInput.status) data = data.filter(p => p.status === toolInput.status);
      return JSON.stringify(data.map(p => ({
        id: p.id, name: p.name, status: p.status, progress: p.progress,
        budget: p.budget, spent: p.spent, manager: p.manager, dueDate: p.dueDate
      })));
    }
    case "query_invoices": {
      let data = invoices;
      if (toolInput.status) data = data.filter(i => i.status === toolInput.status);
      return JSON.stringify(data.map(i => ({
        id: i.id, concept: i.concept, amount: i.amount, status: i.status, dueDate: i.dueDate
      })));
    }
    case "query_tickets": {
      let data = tickets;
      if (toolInput.priority) data = data.filter(t => t.priority === toolInput.priority);
      if (toolInput.status) data = data.filter(t => t.status === toolInput.status);
      return JSON.stringify(data.map(t => ({
        id: t.id, title: t.title, priority: t.priority, status: t.status,
        project: t.project, assignee: t.assignee
      })));
    }
    case "query_documents": {
      return JSON.stringify(documents.map(d => ({
        id: d.id, name: d.name, size: d.size, project: d.project, date: d.date
      })));
    }
    case "create_ticket": {
      const newTicket = {
        id: `TK-${String(tickets.length + 1).padStart(3, "0")}`,
        title: toolInput.title,
        priority: toolInput.priority || "Media",
        status: "Abierto",
        project: "General",
        assignee: "Sin asignar",
        description: toolInput.description || ""
      };
      return JSON.stringify({ success: true, ticket: newTicket });
    }
    case "get_dashboard_summary": {
      const activeProjects = projects.filter(p => p.status !== "Completado").length;
      const pendingInvoices = invoices.filter(i => i.status !== "Pagada");
      const pendingTotal = pendingInvoices.reduce((s, i) => s + i.amount, 0);
      const openTickets = tickets.filter(t => t.status !== "Resuelto").length;
      return JSON.stringify({
        activeProjects, pendingInvoices: pendingInvoices.length,
        pendingTotal, openTickets, totalDocuments: documents.length,
        totalBudget: projects.reduce((s, p) => s + p.budget, 0),
        totalSpent: projects.reduce((s, p) => s + p.spent, 0)
      });
    }
    default:
      return JSON.stringify({ error: "Unknown tool" });
  }
}

async function chatWithToolUse(userMessage, projects, invoices, tickets, documents, lang, apiKey) {
  if (!apiKey) return null;
  try {
    const systemPrompt = `You are an AI assistant for ClientHub, a client portal for ${CURRENT_USER.name} (Plan ${CURRENT_USER.plan}).
Use the available tools to query REAL portal data before answering — do NOT guess or make up numbers.
Respond concisely in ${lang === "en" ? "English" : "Spanish"}. Use **bold** for key figures. Keep answers to 3-5 lines max.
When the user asks to create a ticket, use the create_ticket tool and confirm the details back.`;

    let messages = [{ role: "user", content: userMessage }];
    const MAX_TURNS = 5;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          tools: TOOLS,
          messages
        })
      });
      if (!response.ok) return null;
      const data = await response.json();

      // If stop reason is end_turn or no tool_use blocks, extract text and return
      if (data.stop_reason === "end_turn" || !data.content.some(b => b.type === "tool_use")) {
        const textBlock = data.content.find(b => b.type === "text");
        return textBlock?.text || null;
      }

      // Process tool calls
      messages.push({ role: "assistant", content: data.content });
      const toolResults = [];
      for (const block of data.content) {
        if (block.type === "tool_use") {
          const result = executeClientTool(block.name, block.input, projects, invoices, tickets, documents);
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        }
      }
      messages.push({ role: "user", content: toolResults });
    }
    // If we exhausted turns, return whatever text we got
    return null;
  } catch { return null; }
}

// ─── NOTIFICATION GENERATOR ──────────────────────────────────────────────────
function generateNotifications(invoices, tickets, projects, lang) {
  const notifs = [];
  invoices.forEach(inv => {
    if (inv.status === "Vencida") {
      notifs.push({ id: `notif-inv-${inv.id}`, type: "overdue", text: T.notifOverdueInv[lang](inv.id), ts: Date.now() - 3600000, read: false });
    }
  });
  tickets.forEach(t => {
    if (t.priority === "Alta" && t.status === "Abierto") {
      notifs.push({ id: `notif-tkt-${t.id}`, type: "ticket", text: T.notifHighTicket[lang](t.id), ts: Date.now() - 7200000, read: false });
    }
  });
  projects.forEach(p => {
    if (p.progress >= 90 && p.progress < 100) {
      notifs.push({ id: `notif-prj-${p.id}`, type: "milestone", text: T.notifMilestone[lang](p.name, p.progress), ts: Date.now() - 1800000, read: false });
    }
  });
  return notifs;
}

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

function StatusBadge({ status, lang = "es" }) {
  const s = STATUS_STYLES[status] || { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {tStatus(status, lang)}
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
function ProjectsView({ projects, onUpdateProgress, lang }) {
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
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>{T.pm[lang]} {p.manager} · {T.delivery[lang]} {p.dueDate}</p>
              </div>
              <StatusBadge status={p.status} lang={lang} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>{T.progress[lang]}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
                  {editingId !== p.id && (
                    <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} style={{
                      background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 4,
                      fontSize: 9, color: "#6366F1", cursor: "pointer", padding: "2px 6px", fontWeight: 600,
                    }}>{T.edit[lang]}</button>
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
                    {entry.text} — {timeAgo(entry.ts, lang)}
                  </p>
                ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>{T.budget[lang]}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{fmt(p.budget)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>{T.spent[lang]}</p>
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

function InvoicesView({ invoices, onMarkPaid, onNewInvoice, lang }) {
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
          {T.newInvoice[lang]}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: T.totalBilled[lang], value: fmt(total), color: "#6366F1" },
          { label: T.outstanding[lang], value: fmt(pending), color: "#F59E0B", highlight: pending > 0 },
          { label: T.invoicesCount[lang], value: invoices.length, color: "#10B981" },
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
                {T.pending[lang]}
              </span>
            )}
            <p style={{ margin: "0 0 4px", fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace" }}>{k.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto auto", padding: "10px 18px", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}>
          {[T.invoiceNo[lang], T.concept[lang], T.amount[lang], T.dueDate[lang], T.status[lang], T.action[lang]].map(h => (
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
            <StatusBadge status={inv.status} lang={lang} />
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
                  {T.markPaid[lang]}
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

// ─── DASHBOARD VIEW ──────────────────────────────────────────────────────────
function DashboardView({ projects, invoices, tickets, documents, recentActions, lang }) {
  const activeProjects = projects.filter(p => p.status !== "Completado").length;
  const pendingInvoicesTotal = invoices.filter(i => i.status !== "Pagada").reduce((s, i) => s + i.amount, 0);
  const openTickets = tickets.filter(t => t.status !== "Resuelto").length;

  const kpis = [
    { label: T.kpiActiveProjects[lang], value: activeProjects, color: "#6366F1", icon: "\u25C8" },
    { label: T.kpiPendingInvoices[lang], value: fmt(pendingInvoicesTotal), color: "#F59E0B", icon: "\u25CE" },
    { label: T.kpiOpenTickets[lang], value: openTickets, color: "#EF4444", icon: "\u25C9" },
    { label: T.kpiDocuments[lang], value: documents.length, color: "#10B981", icon: "\u25EB" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "18px 20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)", animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18, color: k.color }}>{k.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace" }}>{k.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Project Overview */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{T.projectOverview[lang]}</h3>
          {projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{p.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} />
            </div>
          ))}
        </div>
        {/* Recent Activity */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{T.recentActivity[lang]}</h3>
          {recentActions.length === 0 ? (
            <p style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic" }}>{T.noRecentActivity[lang]}</p>
          ) : (
            <div style={{ maxHeight: 240, overflowY: "auto" }}>
              {[...recentActions].reverse().slice(0, 10).map((action, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 9 ? "1px solid #F8FAFC" : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", marginTop: 5, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{typeof action === 'string' ? action : action.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketsView({ tickets, onNewTicket, onChangeStatus, onAddComment, lang }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (ticketId) => {
    if (!commentText.trim()) return;
    onAddComment(ticketId, commentText.trim());
    setCommentText("");
  };

  if (selectedTicket) {
    const t = tickets.find(tk => tk.id === selectedTicket);
    if (!t) { setSelectedTicket(null); return null; }
    return (
      <div style={{ animation: "slideIn 0.3s ease" }}>
        <button onClick={() => setSelectedTicket(null)} style={{
          background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8,
          padding: "6px 14px", fontSize: 12, color: "#64748B", cursor: "pointer", marginBottom: 14,
          fontFamily: "'DM Sans', sans-serif",
        }}>&larr; {T.backToList[lang]}</button>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#94A3B8" }}>{t.id} &middot; {t.project} &middot; {t.createdTs ? timeAgo(t.createdTs, lang) : t.created}</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY[t.priority] }}>&#9679; {tPriority(t.priority, lang)}</span>
              <StatusBadge status={t.status} lang={lang} />
            </div>
          </div>
          {t.assignee && (
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#64748B" }}>{T.assignTo[lang]}: <strong>{t.assignee}</strong></p>
          )}
          {t.description && <p style={{ margin: "0 0 16px", fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{t.description}</p>}
          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Thread ({(t.comments || []).length})</h4>
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
              {(t.comments || []).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "8px 12px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6366F1", flexShrink: 0 }}>
                    {c.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#334155" }}>{c.author}</span>
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>{timeAgo(c.ts, lang)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddComment(t.id); }}
                placeholder={T.commentPlaceholder[lang]}
                style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button onClick={() => handleAddComment(t.id)} style={{
                background: "#6366F1", border: "none", borderRadius: 8, padding: "8px 16px",
                fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap",
              }}>{T.addComment[lang]}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {T.newTicket[lang]}
        </button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {tickets.map((t, i) => (
          <div key={t.id} onClick={() => setSelectedTicket(t.id)} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto auto",
            padding: "14px 18px", borderBottom: i < tickets.length - 1 ? "1px solid #F8FAFC" : "none",
            alignItems: "center", gap: 14,
            animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
            transition: "background 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FAFBFE"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>{t.id}</span>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>{t.project} &middot; {t.createdTs ? timeAgo(t.createdTs, lang) : t.created}{t.assignee ? ` &middot; ${t.assignee}` : ""}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY[t.priority] }}>&#9679; {tPriority(t.priority, lang)}</span>
            <StatusBadge status={t.status} lang={lang} />
            <div>
              {t.status !== "Resuelto" ? (
                <button onClick={(e) => { e.stopPropagation(); onChangeStatus(t.id); }} style={{
                  background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 6,
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#4F46E5",
                  cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#C7D2FE"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#EEF2FF"; }}
                >
                  {t.status === "Abierto" ? T.start[lang] : T.resolve[lang]}
                </button>
              ) : (
                <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>{T.closed[lang]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsView({ documents, onUpload, projects, lang }) {
  const fileInputRef = useRef(null);
  const [filterProject, setFilterProject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

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

  const parseSizeMB = (sizeStr) => {
    const n = parseFloat(sizeStr);
    return isNaN(n) ? 0 : n;
  };

  let filtered = [...documents];
  if (filterProject !== "all") filtered = filtered.filter(d => d.project === filterProject);
  if (filterType !== "all") filtered = filtered.filter(d => d.type === filterType);
  if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "size") filtered.sort((a, b) => parseSizeMB(b.size) - parseSizeMB(a.size));
  else filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const uniqueProjects = [...new Set(documents.map(d => d.project))];
  const uniqueTypes = [...new Set(documents.map(d => d.type))];
  const selectStyle = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "#334155", background: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={selectStyle}>
            <option value="all">{T.allProjects[lang]}</option>
            {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
            <option value="all">{T.allTypes[lang]}</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
            <option value="date">{T.sortByDate[lang]}</option>
            <option value="name">{T.sortByName[lang]}</option>
            <option value="size">{T.sortBySize[lang]}</option>
          </select>
        </div>
        <div>
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
            {T.uploadDoc[lang]}
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {filtered.map((d, i) => {
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
                <p style={{ margin: 0, fontSize: 10, color: "#94A3B8" }}>{d.project} &middot; {d.size} &middot; {d.date}</p>
              </div>
              <button style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6,
                padding: "5px 10px", fontSize: 11, color: "#6366F1", cursor: "pointer",
                fontWeight: 600, whiteSpace: "nowrap", transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EEF2FF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; }}
              >
                {T.download[lang]}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DEMO MODE — Context-aware assistant responses (bilingual) ────────────────
function getDemoAssistantResponse(userInput, projects, invoices, tickets, documents, recentActions, lang = "es") {
  const q = userInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const pending = invoices.filter(i => i.status !== "Pagada");
  const pendingTotal = pending.reduce((s, i) => s + i.amount, 0);
  const openTickets = tickets.filter(t => t.status !== "Resuelto");
  const activeProjects = projects.filter(p => p.status !== "Completado");
  const lastAction = recentActions.length > 0 ? recentActions[recentActions.length - 1] : null;
  const isEn = lang === "en";

  // Context-aware: mention recent actions
  if (q.includes("ultimo") || q.includes("reciente") || q.includes("acabo") || q.includes("hice") || q.includes("recent") || q.includes("last")) {
    if (lastAction) {
      return isEn ? `Your last action was: ${lastAction}. Need anything else?` : `Tu ultima accion fue: ${lastAction}. ¿Necesitas algo mas?`;
    }
    return isEn ? "No recent actions recorded in this session. How can I help?" : "No he registrado acciones recientes en esta sesion. ¿En que puedo ayudarte?";
  }

  if (q.includes("proyecto") || q.includes("estado") || q.includes("progreso") || q.includes("avance") || q.includes("project") || q.includes("status") || q.includes("progress")) {
    if (q.includes("crm") || q.includes("erp") || q.includes("integracion") || q.includes("integration")) {
      const p = projects.find(x => x.name.toLowerCase().includes("crm")) || projects[1];
      return isEn
        ? `Project "${p.name}" is in **${tStatus(p.status, lang)}** phase at ${p.progress}%. Manager: ${p.manager}. Due: ${p.dueDate}. Spent: ${fmt(p.spent)} of ${fmt(p.budget)}.`
        : `El proyecto "${p.name}" esta en fase de **${tStatus(p.status, lang)}** con un avance del ${p.progress}%. Manager: ${p.manager}. Fecha de entrega: ${p.dueDate}. Presupuesto ejercido: ${fmt(p.spent)} de ${fmt(p.budget)}.`;
    }
    if (q.includes("app") || q.includes("movil") || q.includes("flutter") || q.includes("mobile")) {
      const p = projects.find(x => x.name.toLowerCase().includes("flutter")) || projects[2];
      return isEn
        ? `"${p.name}" is in **${tStatus(p.status, lang)}** phase at ${p.progress}%. Manager: ${p.manager}. Due: ${p.dueDate}. Budget: ${fmt(p.spent)} spent of ${fmt(p.budget)}.`
        : `La "${p.name}" esta en fase de **${tStatus(p.status, lang)}** con ${p.progress}% de avance. Manager: ${p.manager}. La entrega esta programada para ${p.dueDate}. Presupuesto: ${fmt(p.spent)} ejercido de ${fmt(p.budget)}.`;
    }
    if (q.includes("web") || q.includes("corporativo") || q.includes("rediseno") || q.includes("redesign") || q.includes("corporate")) {
      const p = projects.find(x => x.name.toLowerCase().includes("web")) || projects[0];
      return isEn
        ? `"${p.name}" is at ${p.progress}% — **${tStatus(p.status, lang)}**. Manager: ${p.manager}. Due: ${p.dueDate}. Spent ${fmt(p.spent)} of ${fmt(p.budget)} budget.`
        : `El "${p.name}" avanza al ${p.progress}% — esta **${tStatus(p.status, lang)}**. Manager: ${p.manager}. Entrega estimada: ${p.dueDate}. Se ha ejercido ${fmt(p.spent)} del presupuesto de ${fmt(p.budget)}.`;
    }
    if (q.includes("dashboard") || q.includes("analytics")) {
      const p = projects.find(x => x.name.toLowerCase().includes("dashboard")) || projects[3];
      return isEn
        ? `"${p.name}" is at ${p.progress}% — **${tStatus(p.status, lang)}**. Managed by ${p.manager}. Final budget: ${fmt(p.spent)} of ${fmt(p.budget)}.`
        : `El "${p.name}" esta al ${p.progress}% — **${tStatus(p.status, lang)}**. Fue gestionado por ${p.manager}. Presupuesto final: ${fmt(p.spent)} de ${fmt(p.budget)}.`;
    }
    return isEn
      ? `You have ${activeProjects.length} active projects:\n${projects.map(p => `\u2022 **${p.name}**: ${tStatus(p.status, lang)} (${p.progress}%) — due ${p.dueDate}`).join("\n")}\n\nWant more detail on any specific one?`
      : `Tienes ${activeProjects.length} proyectos activos:\n${projects.map(p => `\u2022 **${p.name}**: ${tStatus(p.status, lang)} (${p.progress}%) — entrega ${p.dueDate}`).join("\n")}\n\n¿Quieres mas detalle de alguno en especifico?`;
  }

  if (q.includes("factura") || q.includes("pendiente") || q.includes("cobrar") || q.includes("pago") || q.includes("debo") || q.includes("cuanto") || q.includes("invoice") || q.includes("billing") || q.includes("payment") || q.includes("owe")) {
    if (pending.length === 0) {
      return isEn ? "You have no pending invoices. All invoices are up to date." : "No tienes facturas pendientes de pago. Todas tus facturas estan al corriente.";
    }
    const overdueNote = pending.some(i => i.status === "Vencida")
      ? (isEn ? "There is an overdue invoice. We recommend settling it soon." : "Hay una factura vencida. Te recomiendo regularizarla a la brevedad.")
      : (isEn ? "All are within the payment period." : "Todas estan dentro de plazo de pago.");
    return isEn
      ? `You have **${pending.length} pending invoices** totaling **${fmt(pendingTotal)}**:\n${pending.map(i => `\u2022 ${i.id}: ${i.concept} — ${fmt(i.amount)} (${tStatus(i.status, lang)}, due ${i.dueDate})`).join("\n")}\n\n${overdueNote}`
      : `Tienes **${pending.length} facturas pendientes** por un total de **${fmt(pendingTotal)}**:\n${pending.map(i => `\u2022 ${i.id}: ${i.concept} — ${fmt(i.amount)} (${tStatus(i.status, lang)}, vence ${i.dueDate})`).join("\n")}\n\n${overdueNote}`;
  }

  if (q.includes("ticket") || q.includes("soporte") || q.includes("problema") || q.includes("error") || q.includes("abierto") || q.includes("support") || q.includes("issue") || q.includes("open")) {
    if (openTickets.length === 0) {
      return isEn ? "You have no open tickets. All support is up to date." : "No tienes tickets abiertos en este momento. Todo el soporte esta al dia.";
    }
    return isEn
      ? `You have **${openTickets.length} active tickets**:\n${openTickets.map(t => `\u2022 ${t.id}: "${t.title}" — ${tPriority(t.priority, lang)} priority, ${tStatus(t.status, lang)} (${t.project})`).join("\n")}\n\nThe support team is working on them. Need to escalate any?`
      : `Tienes **${openTickets.length} tickets activos**:\n${openTickets.map(t => `\u2022 ${t.id}: "${t.title}" — Prioridad ${tPriority(t.priority, lang)}, ${tStatus(t.status, lang)} (${t.project})`).join("\n")}\n\nEl equipo de soporte esta trabajando en ellos. ¿Necesitas escalar alguno?`;
  }

  if (q.includes("documento") || q.includes("archivo") || q.includes("contrato") || q.includes("propuesta") || q.includes("document") || q.includes("file") || q.includes("contract")) {
    return isEn
      ? `You have ${documents.length} documents in your portal:\n${documents.map(d => `\u2022 ${d.name} (${d.size}) — ${d.project}`).join("\n")}\n\nYou can download them from the Documents section.`
      : `Tienes ${documents.length} documentos en tu portal:\n${documents.map(d => `\u2022 ${d.name} (${d.size}) — ${d.project}`).join("\n")}\n\nPuedes descargarlos desde la seccion de Documentos.`;
  }

  if (q.includes("presupuesto") || q.includes("gasto") || q.includes("costo") || q.includes("inversion") || q.includes("budget") || q.includes("spending") || q.includes("cost")) {
    const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
    const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
    const topProject = [...projects].sort((a, b) => (b.spent / b.budget) - (a.spent / a.budget))[0].name;
    return isEn
      ? `Investment summary:\n\u2022 Total budget: **${fmt(totalBudget)}**\n\u2022 Spent: **${fmt(totalSpent)}** (${Math.round(totalSpent / totalBudget * 100)}%)\n\u2022 Available: **${fmt(totalBudget - totalSpent)}**\n\nThe project with the highest budget execution is "${topProject}".`
      : `Resumen de inversion:\n\u2022 Presupuesto total: **${fmt(totalBudget)}**\n\u2022 Ejercido: **${fmt(totalSpent)}** (${Math.round(totalSpent / totalBudget * 100)}%)\n\u2022 Disponible: **${fmt(totalBudget - totalSpent)}**\n\nEl proyecto con mayor ejecucion presupuestal es "${topProject}".`;
  }

  if (q.includes("hola") || q.includes("hey") || q.includes("buenos") || q.includes("buenas") || q.includes("hello") || q.includes("hi")) {
    return isEn
      ? `Hi! Welcome to ${CURRENT_USER.name}'s portal. You have ${activeProjects.length} active projects, ${pending.length} pending invoices (${fmt(pendingTotal)}), and ${openTickets.length} open tickets. How can I help you today?`
      : `Hola! Bienvenido al portal de ${CURRENT_USER.name}. Tienes ${activeProjects.length} proyectos activos, ${pending.length} facturas pendientes (${fmt(pendingTotal)}) y ${openTickets.length} tickets abiertos. ¿En que puedo ayudarte hoy?`;
  }

  if (q.includes("ayuda") || q.includes("que puedes") || q.includes("como funciona") || q.includes("help") || q.includes("what can") || q.includes("how does")) {
    return isEn
      ? "I can help you with:\n\u2022 **Project status** — progress, dates, budget\n\u2022 **Invoices** — pending, amounts, due dates\n\u2022 **Support tickets** — status, priority\n\u2022 **Documents** — contracts, proposals\n\u2022 **General summary** of your account\n\nJust ask me what you need."
      : "Puedo ayudarte con:\n\u2022 **Estado de proyectos** — avance, fechas, presupuesto\n\u2022 **Facturas** — pendientes, montos, vencimientos\n\u2022 **Tickets de soporte** — estado, prioridad\n\u2022 **Documentos** — contratos, propuestas\n\u2022 **Resumen general** de tu cuenta\n\nSolo preguntame lo que necesites.";
  }

  return isEn
    ? `Based on your account (${CURRENT_USER.name}, Plan ${CURRENT_USER.plan}):\n\u2022 ${activeProjects.length} active projects\n\u2022 ${fmt(pendingTotal)} in pending invoices\n\u2022 ${openTickets.length} open support tickets\n\nYou can ask me about your project status, pending invoices, tickets, or documents. How can I help?`
    : `Segun tu cuenta (${CURRENT_USER.name}, Plan ${CURRENT_USER.plan}):\n\u2022 ${activeProjects.length} proyectos activos\n\u2022 ${fmt(pendingTotal)} en facturas pendientes\n\u2022 ${openTickets.length} tickets de soporte abiertos\n\nPuedes preguntarme sobre el estado de tus proyectos, facturas pendientes, tickets o documentos. ¿Como te ayudo?`;
}

// ─── QUICK SUGGESTION CHIPS ──────────────────────────────────────────────────
const getSuggestionChips = (lang) => [
  T.chipProjects[lang],
  T.chipInvoices[lang],
  T.chipTickets[lang],
  T.chipBudget[lang],
];

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AIAssistant({ onClose, projects, invoices, tickets, documents, recentActions, lang, apiKey, sendRef }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: T.aiWelcome[lang],
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

    // Try Claude Tool Use first, fallback to demo
    let response = null;
    let isAI = false;
    if (apiKey) {
      response = await chatWithToolUse(msgText, projects, invoices, tickets, documents, lang, apiKey);
      if (response) isAI = true;
    }
    if (!response) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      response = getDemoAssistantResponse(msgText, projects, invoices, tickets, documents, recentActions, lang);
    }
    setMessages(prev => [...prev, { role: "assistant", content: response, isAI }]);
    setLoading(false);
  };

  // Expose send to parent via ref
  useEffect(() => {
    if (sendRef) sendRef.current = send;
  }, [sendRef, send]);

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: T.chatCleared[lang],
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
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{T.aiTitle[lang]}</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{T.aiPowered[lang]}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {messages.length > 1 && (
            <button onClick={clearChat} title={T.cleanChat[lang]} style={{
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
              {m.role === "assistant" && m.isAI !== undefined && (
                <span style={{
                  display: "inline-block", marginTop: 4, fontSize: 9, fontWeight: 800,
                  padding: "1px 6px", borderRadius: 4,
                  background: m.isAI ? "#DCFCE7" : "#F1F5F9",
                  color: m.isAI ? "#15803D" : "#94A3B8",
                  letterSpacing: "0.05em",
                }}>{m.isAI ? T.aiBadge[lang] : T.demoBadge[lang]}</span>
              )}
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
              <span>{T.typing[lang]}</span>
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
          {getSuggestionChips(lang).map((chip, i) => (
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
          placeholder={T.chatPlaceholder[lang]}
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

// ─── ONBOARDING TOUR ──────────────────────────────────────────────────────────
function OnboardingTour({ lang, setLang, onNavigate, onOpenNotifications, onMarkInvoicePaid, invoices, onOpenNewTicket, setTicketTitle, setTicketProject, setTicketPriority, setTicketDesc, onSubmitTicket, onOpenAI, aiSendMessage, onFinish }) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(true);
  const totalSteps = 10;
  const spotlightRef = useRef(null);
  const [spotlightRect, setSpotlightRect] = useState(null);
  const [tourLang, setTourLang] = useState(lang);

  const tl = tourLang;

  const updateSpotlight = useCallback((selector) => {
    if (!selector) { setSpotlightRect(null); return; }
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotlightRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setSpotlightRect(null);
      }
    }, 400);
  }, []);

  const skip = () => { setActive(false); onFinish(); };

  const goStep = useCallback(async (nextStep) => {
    setStep(nextStep);
    // Auto-actions per step
    switch (nextStep) {
      case 1: // Dashboard KPIs
        onNavigate("dashboard");
        updateSpotlight("[data-tour='dashboard-kpis']");
        break;
      case 2: // Notifications
        updateSpotlight("[data-tour='notif-bell']");
        break;
      case 3: // Projects
        onNavigate("proyectos");
        updateSpotlight("[data-tour='projects-section']");
        break;
      case 4: // Invoices
        onNavigate("facturas");
        updateSpotlight("[data-tour='invoices-section']");
        break;
      case 5: // Mark invoice paid
        {
          const unpaid = invoices.find(i => i.status !== "Pagada");
          if (unpaid) onMarkInvoicePaid(unpaid.id);
        }
        updateSpotlight("[data-tour='invoices-section']");
        break;
      case 6: // Tickets
        onNavigate("tickets");
        updateSpotlight("[data-tour='tickets-section']");
        break;
      case 7: // Create ticket
        onOpenNewTicket();
        setTimeout(() => {
          setTicketTitle(tl === "en" ? "Test ticket from tour" : "Ticket de prueba del tour");
          setTicketProject("Dashboard Analytics");
          setTicketPriority("Media");
          setTicketDesc(tl === "en" ? "This is an automatically created test ticket." : "Este es un ticket de prueba creado automaticamente.");
          setTimeout(() => {
            onSubmitTicket();
            updateSpotlight("[data-tour='tickets-section']");
          }, 600);
        }, 500);
        break;
      case 8: // Documents
        onNavigate("documentos");
        updateSpotlight("[data-tour='docs-section']");
        break;
      case 9: // AI Assistant
        onOpenAI();
        setTimeout(() => {
          aiSendMessage(tl === "en" ? "project status" : "estado de proyectos");
        }, 800);
        setSpotlightRect(null);
        break;
      case 10: // Finish
        setSpotlightRect(null);
        break;
      default:
        break;
    }
  }, [tl, onNavigate, updateSpotlight, onMarkInvoicePaid, invoices, onOpenNewTicket, setTicketTitle, setTicketProject, setTicketPriority, setTicketDesc, onSubmitTicket, onOpenAI, aiSendMessage]);

  if (!active) return null;

  const stepConfig = [
    // Step 0 — Welcome
    { title: T.tourWelcomeTitle[tl], text: T.tourWelcomeText[tl], isWelcome: true },
    // Step 1 — Dashboard
    { title: T.tourDashboardTitle[tl], text: T.tourDashboardText[tl] },
    // Step 2 — Notifications
    { title: T.tourNotifTitle[tl], text: T.tourNotifText[tl], tryIt: true, tryAction: () => { onOpenNotifications(); } },
    // Step 3 — Projects
    { title: T.tourProjectsTitle[tl], text: T.tourProjectsText[tl] },
    // Step 4 — Invoices
    { title: T.tourInvoicesTitle[tl], text: T.tourInvoicesText[tl] },
    // Step 5 — Mark paid
    { title: T.tourInvoicePaidTitle[tl], text: T.tourInvoicePaidText[tl] },
    // Step 6 — Tickets
    { title: T.tourTicketsTitle[tl], text: T.tourTicketsText[tl] },
    // Step 7 — Create ticket
    { title: T.tourCreateTicketTitle[tl], text: T.tourCreateTicketText[tl] },
    // Step 8 — Documents
    { title: T.tourDocsTitle[tl], text: T.tourDocsText[tl] },
    // Step 9 — AI
    { title: T.tourAITitle[tl], text: T.tourAIText[tl] },
    // Step 10 — Finish
    { title: T.tourFinishTitle[tl], text: T.tourFinishText[tl], isFinish: true },
  ];

  const current = stepConfig[step] || stepConfig[0];

  const handleNext = () => {
    if (step >= totalSteps) { skip(); return; }
    goStep(step + 1);
  };

  const handleTryIt = () => {
    if (current.tryAction) current.tryAction();
    setTimeout(() => handleNext(), 800);
  };

  const handleStart = () => {
    setLang(tourLang);
    goStep(1);
  };

  // Backdrop + spotlight overlay
  const backdropStyle = {
    position: "fixed", inset: 0, zIndex: 10000,
    background: "rgba(0,0,0,0.6)",
    transition: "all 0.3s ease",
  };

  const spotlightStyle = spotlightRect ? {
    position: "fixed",
    top: spotlightRect.top, left: spotlightRect.left,
    width: spotlightRect.width, height: spotlightRect.height,
    borderRadius: 14,
    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55), 0 0 30px 4px rgba(99,102,241,0.4)",
    zIndex: 10001,
    pointerEvents: "none",
    transition: "all 0.4s ease",
  } : null;

  const tooltipStyle = {
    position: "fixed", zIndex: 10002,
    background: "#fff", borderRadius: 18, padding: "24px 28px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
    maxWidth: 420, width: "90vw",
    animation: "fadeUp 0.35s ease",
    fontFamily: "'DM Sans', sans-serif",
  };

  // Position tooltip near spotlight or center
  const getTooltipPos = () => {
    if (step === 0 || !spotlightRect || current.isFinish) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
    const below = spotlightRect.top + spotlightRect.height + 16;
    const above = spotlightRect.top - 220;
    if (below + 220 < window.innerHeight) {
      return { top: below, left: Math.max(16, Math.min(spotlightRect.left, window.innerWidth - 440)) };
    }
    return { top: Math.max(16, above), left: Math.max(16, Math.min(spotlightRect.left, window.innerWidth - 440)) };
  };

  const pos = getTooltipPos();

  return (
    <>
      {/* Backdrop */}
      <div style={backdropStyle} onClick={e => e.stopPropagation()} />

      {/* Spotlight */}
      {spotlightStyle && <div ref={spotlightRef} style={spotlightStyle} />}

      {/* Tooltip */}
      <div style={{ ...tooltipStyle, ...pos }} onClick={e => e.stopPropagation()}>
        {/* Step counter */}
        {step > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {T.tourStepOf[tl](step, totalSteps)}
            </span>
            <button onClick={skip} style={{
              background: "none", border: "none", fontSize: 11, color: "#94A3B8",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              textDecoration: "underline", padding: 0,
            }}>{T.tourSkip[tl]}</button>
          </div>
        )}

        {/* Progress bar */}
        {step > 0 && (
          <div style={{ height: 3, background: "#F1F5F9", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(step / totalSteps) * 100}%`, background: "#6366F1", borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>
        )}

        <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          {current.title}
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748B", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {current.text}
        </p>

        {/* Welcome step: language selector */}
        {current.isWelcome && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {T.tourLangSelect[tl]}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["es", "en"].map(l => (
                <button key={l} onClick={() => setTourLang(l)} style={{
                  padding: "8px 20px", borderRadius: 8,
                  background: tourLang === l ? "#6366F1" : "#F8FAFC",
                  color: tourLang === l ? "#fff" : "#64748B",
                  border: tourLang === l ? "none" : "1px solid #E2E8F0",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {l === "es" ? "Espanol" : "English"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {current.isWelcome && (
            <>
              <button onClick={skip} style={{
                padding: "10px 20px", border: "1px solid #E2E8F0", borderRadius: 10,
                background: "#fff", fontSize: 13, color: "#64748B", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              }}>{T.tourSkip[tl]}</button>
              <button onClick={handleStart} style={{
                padding: "10px 24px", border: "none", borderRadius: 10,
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >{T.tourStartBtn[tl]}</button>
            </>
          )}

          {!current.isWelcome && !current.isFinish && (
            <>
              {current.tryIt ? (
                <button onClick={handleTryIt} style={{
                  padding: "10px 24px", border: "none", borderRadius: 10,
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}>{T.tourTryIt[tl]}</button>
              ) : (
                <button onClick={handleNext} style={{
                  padding: "10px 24px", border: "none", borderRadius: 10,
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}>{T.tourNext[tl]}</button>
              )}
            </>
          )}

          {current.isFinish && (
            <button onClick={skip} style={{
              padding: "10px 24px", border: "none", borderRadius: 10,
              background: "linear-gradient(135deg, #22C55E, #16A34A)",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
            }}>{T.tourFinish[tl]}</button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
function ContactBar({ lang }) {
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
      <span style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 500 }}>{T.ctaText[lang]}</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <a href="https://impulso-ia-navy.vercel.app/#contacto" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s' }}>{T.ctaTalk[lang]}</a>
        <a href="https://wa.me/525579605324?text=Hola%20Christian%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20tus%20servicios%20de%20IA" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>WhatsApp</a>
        <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 18, cursor: 'pointer', padding: '4px 8px' }}>✕</button>
      </div>
    </div>
  );
}

export default function ClientPortal() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAI, setShowAI] = useState(false);
  const [visitedSections, setVisitedSections] = useState({ dashboard: true });
  const [lang, setLang] = useState("es");
  const [showTour, setShowTour] = useState(true);
  const aiSendRef = useRef(null);

  // ── API Key ──
  const [apiKey, setApiKey] = useState(() => lsGet(LS_KEYS.apiKey, ""));
  const [showApiKey, setShowApiKey] = useState(false);

  // ── Live state (restore from localStorage or use defaults) ──
  const [projects, setProjects] = useState(() => lsGet(LS_KEYS.projects, INITIAL_PROJECTS));
  const [invoices, setInvoices] = useState(() => lsGet(LS_KEYS.invoices, INITIAL_INVOICES));
  const [tickets, setTickets] = useState(() => lsGet(LS_KEYS.tickets, INITIAL_TICKETS));
  const [documents, setDocuments] = useState(() => lsGet(LS_KEYS.documents, INITIAL_DOCUMENTS));
  const [recentActions, setRecentActions] = useState(() => lsGet(LS_KEYS.actions, []));

  // ── Notifications ──
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Persist to localStorage on state changes
  useEffect(() => { lsSet(LS_KEYS.projects, projects); }, [projects]);
  useEffect(() => { lsSet(LS_KEYS.invoices, invoices); }, [invoices]);
  useEffect(() => { lsSet(LS_KEYS.tickets, tickets); }, [tickets]);
  useEffect(() => { lsSet(LS_KEYS.documents, documents); }, [documents]);
  useEffect(() => { lsSet(LS_KEYS.actions, recentActions); }, [recentActions]);
  useEffect(() => { lsSet(LS_KEYS.apiKey, apiKey); }, [apiKey]);

  // Generate notifications from current data
  useEffect(() => {
    setNotifications(generateNotifications(invoices, tickets, projects, lang));
  }, [invoices, tickets, projects, lang]);

  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setInvoices(INITIAL_INVOICES);
    setTickets(INITIAL_TICKETS);
    setDocuments(INITIAL_DOCUMENTS);
    setRecentActions([]);
    Object.values(LS_KEYS).forEach(k => { if (k !== LS_KEYS.apiKey) localStorage.removeItem(k); });
    addToast(lang === "es" ? "Datos restaurados" : "Data reset", "info");
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const markAllNotificationsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); };

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
      setTicketError(T.ticketTitleError[lang]);
      return;
    }
    const newId = `TKT-${String(ticketCounter.current++).padStart(4, "0")}`;
    const newTicket = {
      id: newId,
      title: ticketTitle.trim(),
      priority: ticketPriority,
      status: "Abierto",
      created: todayStr(),
      createdTs: Date.now(),
      project: ticketProject,
      description: ticketDesc,
      assignee: "",
      comments: [],
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketError("");
    setShowNewTicket(false);
    setTicketTitle("");
    setTicketProject(projects[0]?.name || "");
    setTicketPriority("Media");
    setTicketDesc("");
    addToast(T.toastTicketCreated[lang](newId, newTicket.title), "success");
    logAction(`Creaste el ticket ${newId}: "${newTicket.title}" (${ticketPriority}, ${ticketProject})`);
  };

  const handleChangeTicketStatus = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const idx = TICKET_STATUS_FLOW.indexOf(t.status);
      if (idx < 0 || idx >= TICKET_STATUS_FLOW.length - 1) return t;
      const newStatus = TICKET_STATUS_FLOW[idx + 1];
      addToast(T.toastTicketChanged[lang](t.id, tStatus(newStatus, lang)), "info");
      logAction(`Cambiaste el ticket ${t.id} de "${t.status}" a "${newStatus}"`);
      return { ...t, status: newStatus };
    }));
  };

  const handleMarkInvoicePaid = (invoiceId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      addToast(T.toastInvoicePaid[lang](inv.id, fmt(inv.amount)), "success");
      logAction(`Marcaste la factura ${inv.id} como pagada — ${fmt(inv.amount)}`);
      return { ...inv, status: "Pagada" };
    }));
  };

  const handleSubmitInvoice = () => {
    if (!invConcept.trim()) {
      setInvError(T.conceptRequired[lang]);
      return;
    }
    const amount = parseFloat(invAmount);
    if (!amount || amount <= 0) {
      setInvError(T.amountInvalid[lang]);
      return;
    }
    if (!invDueDate) {
      setInvError(T.dueDateRequired[lang]);
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
    addToast(T.toastInvoiceCreated[lang](newId, fmt(amount)), "success");
    logAction(`Creaste la factura ${newId}: "${invConcept.trim()}" por ${fmt(amount)}`);
  };

  const handleUpdateProgress = (projectId, newProgress) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const logEntry = { text: `Progreso actualizado a ${newProgress}%`, ts: Date.now() };
      addToast(T.toastProjectUpdated[lang](p.name, newProgress), "info");
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
    addToast(T.toastDocUploaded[lang](fileInfo.name), "success");
    logAction(`Subiste el documento "${fileInfo.name}" (${fileInfo.size})`);
  };

  const handleAddComment = (ticketId, text) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const newComment = { author: CURRENT_USER.name, text, ts: Date.now() };
      return { ...t, comments: [...(t.comments || []), newComment] };
    }));
    logAction(`Comentaste en ticket ${ticketId}`);
  };

  // ── Nav counts (live) ──
  const NAV = [
    { id: "dashboard", label: T.navDashboard[lang], icon: "\u25A3", count: null },
    { id: "proyectos", label: T.navProjects[lang], icon: "\u25C8", count: projects.filter(p => p.status !== "Completado").length },
    { id: "facturas",  label: T.navInvoices[lang],  icon: "\u25CE", count: invoices.filter(i => i.status !== "Pagada").length },
    { id: "tickets",   label: T.navSupport[lang],   icon: "\u25C9", count: tickets.filter(t => t.status === "Abierto").length },
    { id: "documentos",label: T.navDocuments[lang],icon: "\u25EB", count: null },
  ];

  const SECTION_TITLES = { dashboard: T.titleDashboard[lang], proyectos: T.titleProjects[lang], facturas: T.titleInvoices[lang], tickets: T.titleTickets[lang], documentos: T.titleDocuments[lang] };

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
            {T.portalSubtitle[lang]}
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
                {T.plan[lang]} {CURRENT_USER.plan}
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
              {T.aiAssistant[lang]}
            </span>
            <span style={{ marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 4, background: showAI ? "rgba(255,255,255,0.2)" : "#EEF2FF", color: showAI ? "#fff" : "#6366F1", fontWeight: 700 }}>
              CLAUDE
            </span>
          </button>
        </div>

        {/* API Key Section */}
        <div style={{ padding: "8px 12px 0" }}>
          <button onClick={() => setShowApiKey(v => !v)} style={{
            width: "100%", padding: "7px 10px", background: "transparent",
            border: "1px solid #F1F5F9", borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: 10, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif",
          }}>
            <span>{T.apiKeyLabel[lang]}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
              background: apiKey ? "#DCFCE7" : "#FFF7ED",
              color: apiKey ? "#15803D" : "#C2410C",
            }}>{apiKey ? T.aiMode[lang] : T.demoMode[lang]}</span>
          </button>
          {showApiKey && (
            <div style={{ marginTop: 6, padding: "0 2px" }}>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                style={{
                  width: "100%", border: "1px solid #E2E8F0", borderRadius: 6,
                  padding: "6px 8px", fontSize: 10, color: "#334155",
                  fontFamily: "'DM Mono', monospace",
                }}
              />
            </div>
          )}
        </div>

        {/* Reset Demo Data */}
        <div style={{ padding: "8px 12px 0" }}>
          <button onClick={resetDemoData} style={{
            width: "100%", padding: "7px 10px", background: "transparent",
            border: "1px solid #F1F5F9", borderRadius: 8, cursor: "pointer",
            fontSize: 10, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FFF1F2"; e.currentTarget.style.color = "#BE123C"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            {T.resetData[lang]}
          </button>
        </div>

        <p style={{ margin: "12px 20px 0", fontSize: 9, color: "#CBD5E1", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {T.builtWith[lang]}
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
              {T.welcome[lang]} {CURRENT_USER.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Notification Bell */}
            <div style={{ position: "relative" }} data-tour="notif-bell">
              <button onClick={() => setShowNotifications(v => !v)} style={{
                background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8,
                width: 36, height: 36, cursor: "pointer", fontSize: 16, position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
              >
                &#128276;
                {unreadNotifCount > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800,
                    width: 16, height: 16, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{unreadNotifCount}</span>
                )}
              </button>
              {showNotifications && (
                <div style={{
                  position: "absolute", top: 42, right: 0, width: 320,
                  background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 100,
                  animation: "fadeUp 0.2s ease", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{T.notifications[lang]}</span>
                    {unreadNotifCount > 0 && (
                      <button onClick={markAllNotificationsRead} style={{
                        background: "none", border: "none", fontSize: 11, color: "#6366F1",
                        cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                      }}>{T.markAllRead[lang]}</button>
                    )}
                  </div>
                  <div style={{ maxHeight: 240, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <p style={{ padding: 16, fontSize: 12, color: "#94A3B8", textAlign: "center" }}>{T.noNotifications[lang]}</p>
                    ) : notifications.map(n => (
                      <div key={n.id} style={{
                        padding: "10px 16px", borderBottom: "1px solid #F8FAFC",
                        background: n.read ? "transparent" : "#FAFBFE",
                        display: "flex", gap: 10, alignItems: "flex-start",
                      }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                          background: n.type === "overdue" ? "#EF4444" : n.type === "ticket" ? "#F59E0B" : "#6366F1",
                        }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 12, color: "#334155", lineHeight: 1.4 }}>{n.text}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94A3B8" }}>{timeAgo(n.ts, lang)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Language toggle */}
            <div style={{
              display: "flex", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden",
            }}>
              <button onClick={() => setLang("es")} style={{
                padding: "8px 12px", fontSize: 11, fontWeight: lang === "es" ? 700 : 400,
                color: lang === "es" ? "#6366F1" : "#94A3B8",
                background: lang === "es" ? "#EEF2FF" : "transparent",
                border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
              }}>ES</button>
              <div style={{ width: 1, background: "#E2E8F0" }} />
              <button onClick={() => setLang("en")} style={{
                padding: "8px 12px", fontSize: 11, fontWeight: lang === "en" ? 700 : 400,
                color: lang === "en" ? "#6366F1" : "#94A3B8",
                background: lang === "en" ? "#EEF2FF" : "transparent",
                border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
              }}>EN</button>
            </div>
            <div style={{ fontSize: 11, color: "#64748B", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 14px" }}>
              {new Date().toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Content with transition */}
        <div style={{ animation: "slideIn 0.35s ease" }} key={activeSection}>
          {activeSection === "dashboard"  && <div data-tour="dashboard-kpis"><DashboardView projects={projects} invoices={invoices} tickets={tickets} documents={documents} recentActions={recentActions} lang={lang} /></div>}
          {activeSection === "proyectos"  && <div data-tour="projects-section"><ProjectsView projects={projects} onUpdateProgress={handleUpdateProgress} lang={lang} /></div>}
          {activeSection === "facturas"   && <div data-tour="invoices-section"><InvoicesView invoices={invoices} onMarkPaid={handleMarkInvoicePaid} onNewInvoice={() => setShowNewInvoice(true)} lang={lang} /></div>}
          {activeSection === "tickets"    && <div data-tour="tickets-section"><TicketsView tickets={tickets} onNewTicket={() => setShowNewTicket(true)} onChangeStatus={handleChangeTicketStatus} onAddComment={handleAddComment} lang={lang} /></div>}
          {activeSection === "documentos" && <div data-tour="docs-section"><DocumentsView documents={documents} onUpload={handleUploadDocument} projects={projects} lang={lang} /></div>}
        </div>
      </div>

      {/* AI Assistant */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} projects={projects} invoices={invoices} tickets={tickets} documents={documents} recentActions={recentActions} lang={lang} apiKey={apiKey} sendRef={aiSendRef} />}

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
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{T.newTicketTitle[lang]}</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.ticketTitleLabel[lang]}
              </label>
              <input
                value={ticketTitle}
                onChange={e => { setTicketTitle(e.target.value); setTicketError(""); }}
                style={{
                  width: "100%", border: `1px solid ${ticketError ? "#EF4444" : "#E2E8F0"}`,
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                  transition: "border-color 0.2s",
                }}
                placeholder={T.ticketMinChars[lang]}
              />
              {ticketError && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{ticketError}</p>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.relatedProject[lang]}
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
                {T.priority[lang]}
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
                    {tPriority(pr, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.detailedDesc[lang]}
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
                {T.cancel[lang]}
              </button>
              <button onClick={handleSubmitTicket} style={{
                padding: "9px 18px", border: "none", borderRadius: 8, background: "#6366F1",
                fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {T.submitTicket[lang]}
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
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{T.newInvoiceTitle[lang]}</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.conceptLabel[lang]}
              </label>
              <input
                value={invConcept}
                onChange={e => { setInvConcept(e.target.value); setInvError(""); }}
                style={{
                  width: "100%", border: `1px solid ${invError && !invConcept.trim() ? "#EF4444" : "#E2E8F0"}`,
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                }}
                placeholder={T.conceptPlaceholder[lang]}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.amountLabel[lang]}
              </label>
              <input
                type="number"
                value={invAmount}
                onChange={e => { setInvAmount(e.target.value); setInvError(""); }}
                style={{
                  width: "100%", border: "1px solid #E2E8F0",
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155",
                }}
                placeholder={T.amountPlaceholder[lang]}
                min="0"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.dueDateLabel[lang]}
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
                {T.cancel[lang]}
              </button>
              <button onClick={handleSubmitInvoice} style={{
                padding: "9px 18px", border: "none", borderRadius: 8, background: "#6366F1",
                fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {T.createInvoice[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <ContactBar lang={lang} />
    {showTour && (
      <OnboardingTour
        lang={lang}
        setLang={setLang}
        onNavigate={switchSection}
        onOpenNotifications={() => setShowNotifications(true)}
        onMarkInvoicePaid={handleMarkInvoicePaid}
        invoices={invoices}
        onOpenNewTicket={() => setShowNewTicket(true)}
        setTicketTitle={setTicketTitle}
        setTicketProject={setTicketProject}
        setTicketPriority={setTicketPriority}
        setTicketDesc={setTicketDesc}
        onSubmitTicket={handleSubmitTicket}
        onOpenAI={() => setShowAI(true)}
        aiSendMessage={(msg) => { setTimeout(() => { if (aiSendRef.current) aiSendRef.current(msg); }, 600); }}
        onFinish={() => setShowTour(false)}
      />
    )}
    </>
  );
}
