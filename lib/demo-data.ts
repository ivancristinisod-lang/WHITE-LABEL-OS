import type { AppState } from "./types";

const d = (days = 0) => {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

export const initialDemoState: AppState = {
  organization: {
    id: "northstar-demo",
    name: "Northstar Studio",
    productName: "Northstar OS",
    undoSeconds: 10,
    requireClosureEvidence: true
  },
  departments: [
    { id: "dir", key: "direction", name: "Dirección" },
    { id: "ops", key: "operations", name: "Operaciones" },
    { id: "tech", key: "product-tech", name: "Producto & Tech" },
    { id: "growth", key: "growth", name: "Growth & Marca" }
  ],
  profiles: [
    { id: "p1", name: "Alex Morgan", role: "Owner", active: true },
    { id: "p2", name: "Nina Silva", role: "Operations", active: true },
    { id: "p3", name: "Kai Chen", role: "Product", active: true },
    { id: "p4", name: "Mara Costa", role: "Growth", active: true },
    { id: "p5", name: "Former Member", role: "Viewer", active: false }
  ],
  tickets: [
    { id: "t1", number: 101, title: "Definir criterio de lanzamiento", departmentId: "dir", ownerId: "p1", dueDate: d(0), decisionNeeded: "Aprobar alcance final del release", nextAction: "Revisar riesgos", status: "open", priority: "high", version: 1, createdAt: new Date().toISOString() },
    { id: "t2", number: 102, title: "Cerrar onboarding del equipo piloto", departmentId: "ops", ownerId: "p2", dueDate: d(1), blocker: "Falta confirmación de dos usuarios", nextAction: "Contactar pendientes", status: "open", priority: "high", version: 1, createdAt: new Date().toISOString() },
    { id: "t3", number: 103, title: "Pulir vista móvil de tickets", departmentId: "tech", ownerId: "p3", dueDate: d(0), nextAction: "Validar en 390px", status: "open", priority: "medium", version: 2, createdAt: new Date().toISOString() },
    { id: "t4", number: 104, title: "Preparar narrativa para demo", departmentId: "growth", ownerId: "p4", dueDate: d(3), nextAction: "Escribir guión de 5 minutos", status: "open", priority: "medium", version: 1, createdAt: new Date().toISOString() },
    { id: "t5", number: 105, title: "Mapa de permisos inicial", departmentId: "tech", ownerId: "p3", dueDate: d(-1), blocker: "Esperando validación de roles", status: "open", priority: "high", version: 1, createdAt: new Date().toISOString() },
    { id: "t6", number: 106, title: "Checklist de evidencia", departmentId: "ops", ownerId: "p2", dueDate: d(-2), evidence: "Checklist aprobado", status: "done", priority: "low", version: 3, createdAt: new Date().toISOString(), closedAt: new Date().toISOString() }
  ],
  subtasks: [
    { id: "s1", ticketId: "t1", title: "Listar opciones", done: true, ownerId: "p1" },
    { id: "s2", ticketId: "t1", title: "Escribir recomendación", done: false, ownerId: "p1" },
    { id: "s3", ticketId: "t2", title: "Enviar recordatorio", done: false, ownerId: "p2" },
    { id: "s4", ticketId: "t3", title: "Test iPhone", done: true, ownerId: "p3" },
    { id: "s5", ticketId: "t3", title: "Test Android", done: false, ownerId: "p3" }
  ],
  audit: [
    { id: "a1", entityType: "ticket", entityId: "t6", action: "closed", actor: "Nina Silva", createdAt: new Date().toISOString(), detail: "Ticket cerrado con evidencia." }
  ],
  inbox: [
    { id: "m1", from: "Operations", to: "Product & Tech", message: "Necesitamos validar el flujo móvil antes de la demo.", createdAt: new Date().toISOString() }
  ]
};
