"use client";

import { useMemo, useState } from "react";
import { useDemoStore } from "./demo-store";
import type { Ticket } from "@/lib/types";

type Filter = "open" | "today" | "blockers" | "decisions";

export function Dashboard() {
  const { state } = useDemoStore();
  const [filter, setFilter] = useState<Filter>("open");
  const today = new Date().toISOString().slice(0, 10);
  const matches = (ticket: Ticket, kind: Filter) => kind === "open" ? ticket.status === "open" : kind === "today" ? ticket.status === "open" && ticket.dueDate === today : kind === "blockers" ? ticket.status === "open" && Boolean(ticket.blocker) : ticket.status === "open" && Boolean(ticket.decisionNeeded);
  const counts = { open: state.tickets.filter(t => matches(t,"open")).length, today: state.tickets.filter(t => matches(t,"today")).length, blockers: state.tickets.filter(t => matches(t,"blockers")).length, decisions: state.tickets.filter(t => matches(t,"decisions")).length };
  const visible = useMemo(() => state.tickets.filter(t => matches(t, filter)), [state.tickets, filter]);
  return <>
    <div className="page-head"><div><h1>Panel General</h1><p>Una vista simple de lo que hay que ejecutar, destrabar y decidir.</p></div></div>
    <div className="grid grid-4">{([ ["open","Abiertas",counts.open], ["today","Hoy",counts.today], ["blockers","Bloqueos",counts.blockers], ["decisions","Decisiones",counts.decisions] ] as const).map(([key,label,value]) => <button className="kpi" data-active={filter===key} key={key} onClick={() => setFilter(key)}><span>{label}</span><b>{value}</b></button>)}</div>
    <div className="card" style={{marginTop:18}}><h2 className="section-title">{filter === "open" ? "Tareas abiertas" : filter === "today" ? "Vencen hoy" : filter === "blockers" ? "Con bloqueos" : "Necesitan decisión"}</h2>
      {visible.length===0 ? <div className="empty">No hay tareas en este filtro.</div> : visible.map(ticket => { const dep=state.departments.find(d=>d.id===ticket.departmentId); const owner=state.profiles.find(p=>p.id===ticket.ownerId); return <div className="ticket" key={ticket.id}><div><h3>#{ticket.number} · {ticket.title}</h3><div className="meta"><span>{dep?.name}</span><span>{owner?.name || "Sin responsable"}</span>{ticket.dueDate ? <span>vence {ticket.dueDate}</span>:null}{ticket.blocker ? <span className="pill blocked">Bloqueo</span>:null}{ticket.decisionNeeded ? <span className="pill decision">Decisión</span>:null}</div></div></div>; })}
    </div>
  </>;
}
