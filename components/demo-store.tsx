"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { initialDemoState } from "@/lib/demo-data";
import type { AppState, Ticket } from "@/lib/types";

type UndoRecord = { label: string; previous: AppState; expiresAt: number } | null;
type Store = {
  state: AppState;
  undo: UndoRecord;
  createTicket: (input: Pick<Ticket, "title" | "departmentId" | "priority"> & Partial<Pick<Ticket, "ownerId" | "dueDate" | "description">>) => void;
  toggleSubtask: (id: string) => void;
  addSubtask: (ticketId: string, title: string, ownerId?: string) => void;
  rescheduleTicket: (ticketId: string, dueDate: string) => void;
  closeTicket: (ticketId: string, evidence: string) => { ok: boolean; error?: string };
  reopenTicket: (ticketId: string) => void;
  sendInbox: (to: string, message: string) => void;
  performUndo: () => void;
  resetDemo: () => void;
};

const DemoStore = createContext<Store | null>(null);
const STORAGE_KEY = "white-label-os-demo-v1";

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialDemoState);
  const [undo, setUndo] = useState<UndoRecord>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setState(JSON.parse(raw) as AppState); } catch { }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!undo) return;
    const ms = Math.max(0, undo.expiresAt - Date.now());
    const timer = window.setTimeout(() => setUndo(null), ms);
    return () => window.clearTimeout(timer);
  }, [undo]);

  const mutate = useCallback((label: string, fn: (current: AppState) => AppState) => {
    const previous = structuredClone(stateRef.current);
    const next = fn(previous);
    setState(next);
    setUndo({ label, previous: stateRef.current, expiresAt: Date.now() + stateRef.current.organization.undoSeconds * 1000 });
  }, []);

  const addAudit = (current: AppState, entityId: string, action: string, detail: string): AppState => ({
    ...current,
    audit: [{
      id: crypto.randomUUID(),
      entityType: "ticket",
      entityId,
      action,
      actor: "Demo Owner",
      createdAt: new Date().toISOString(),
      detail
    }, ...current.audit]
  });

  const createTicket: Store["createTicket"] = (input) => mutate("Ticket creado", current => {
    const number = Math.max(100, ...current.tickets.map(t => t.number)) + 1;
    const ticket: Ticket = {
      id: crypto.randomUUID(), number, title: input.title, description: input.description,
      departmentId: input.departmentId, ownerId: input.ownerId || undefined, dueDate: input.dueDate || undefined,
      status: "open", priority: input.priority, version: 1, createdAt: new Date().toISOString()
    };
    return addAudit({ ...current, tickets: [ticket, ...current.tickets] }, ticket.id, "created", "Ticket creado.");
  });

  const toggleSubtask = (id: string) => mutate("Subtarea actualizada", current => {
    const sub = current.subtasks.find(s => s.id === id);
    const next = { ...current, subtasks: current.subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s) };
    return sub ? addAudit(next, sub.ticketId, "subtask_updated", `Subtarea ${sub.done ? "reabierta" : "completada"}.`) : next;
  });

  const addSubtask = (ticketId: string, title: string, ownerId?: string) => mutate("Subtarea creada", current =>
    addAudit({ ...current, subtasks: [...current.subtasks, { id: crypto.randomUUID(), ticketId, title, ownerId, done: false }] }, ticketId, "subtask_created", "Subtarea creada.")
  );

  const rescheduleTicket = (ticketId: string, dueDate: string) => mutate("Fecha modificada", current => {
    const next = { ...current, tickets: current.tickets.map(t => t.id === ticketId ? { ...t, dueDate, version: t.version + 1 } : t) };
    return addAudit(next, ticketId, "due_date_changed", `Nueva fecha límite: ${dueDate}.`);
  });

  const closeTicket: Store["closeTicket"] = (ticketId, evidence) => {
    if (stateRef.current.organization.requireClosureEvidence && !evidence.trim()) return { ok: false, error: "Necesitás evidencia para cerrar este ticket." };
    mutate("Ticket cerrado", current => {
      const next = { ...current, tickets: current.tickets.map(t => t.id === ticketId ? { ...t, status: "done" as const, evidence: evidence.trim(), closedAt: new Date().toISOString(), version: t.version + 1 } : t) };
      return addAudit(next, ticketId, "closed", "Ticket cerrado con evidencia.");
    });
    return { ok: true };
  };

  const reopenTicket = (ticketId: string) => mutate("Ticket reabierto", current =>
    addAudit({ ...current, tickets: current.tickets.map(t => t.id === ticketId ? { ...t, status: "open" as const, closedAt: undefined, version: t.version + 1 } : t) }, ticketId, "reopened", "Ticket reabierto.")
  );

  const sendInbox = (to: string, message: string) => mutate("Mensaje enviado", current => ({
    ...current, inbox: [{ id: crypto.randomUUID(), from: "General", to, message, createdAt: new Date().toISOString() }, ...current.inbox]
  }));

  const performUndo = () => { if (!undo || undo.expiresAt < Date.now()) return; setState(undo.previous); setUndo(null); };
  const resetDemo = () => { setState(initialDemoState); setUndo(null); window.localStorage.removeItem(STORAGE_KEY); };

  const value = useMemo<Store>(() => ({ state, undo, createTicket, toggleSubtask, addSubtask, rescheduleTicket, closeTicket, reopenTicket, sendInbox, performUndo, resetDemo }), [state, undo]);

  return <DemoStore.Provider value={value}>{children}{undo ? <div className="undo"><span>{undo.label} · {Math.max(0, Math.ceil((undo.expiresAt - Date.now()) / 1000))}s para deshacer</span><button onClick={performUndo}>Deshacer</button></div> : null}</DemoStore.Provider>;
}

export function useDemoStore() {
  const value = useContext(DemoStore);
  if (!value) throw new Error("useDemoStore must be used inside DemoStoreProvider");
  return value;
}
