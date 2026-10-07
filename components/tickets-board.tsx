"use client";

import { FormEvent, useMemo, useState } from "react";
import { useDemoStore } from "./demo-store";

export function TicketsBoard() {
  const { state, createTicket, toggleSubtask, addSubtask, rescheduleTicket, closeTicket, reopenTicket } = useDemoStore();
  const [query,setQuery]=useState(""); const [department,setDepartment]=useState("all"); const [title,setTitle]=useState(""); const [dep,setDep]=useState(state.departments[0]?.id||""); const [owner,setOwner]=useState(""); const [due,setDue]=useState(""); const [priority,setPriority]=useState<"high"|"medium"|"low">("medium");
  const activeProfiles = state.profiles.filter(p => p.active);
  const visible=useMemo(()=>state.tickets.filter(t=>`${t.number} ${t.title}`.toLowerCase().includes(query.toLowerCase()) && (department==="all"||t.departmentId===department)),[state.tickets,query,department]);
  const submit=(event:FormEvent)=>{event.preventDefault(); if(!title.trim()||!dep)return; createTicket({title:title.trim(),departmentId:dep,ownerId:owner||undefined,dueDate:due||undefined,priority}); setTitle("");setDue("");};
  return <>
    <div className="page-head"><div><h1>Tickets</h1><p>Crear, asignar, ejecutar y cerrar con trazabilidad.</p></div></div>
    <div className="card"><h2 className="section-title">Agregar ticket</h2><form className="form-grid" onSubmit={submit}>
      <input className="input" placeholder="Qué hay que lograr" value={title} onChange={e=>setTitle(e.target.value)}/>
      <select className="select" value={dep} onChange={e=>setDep(e.target.value)}>{state.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
      <select className="select" value={owner} onChange={e=>setOwner(e.target.value)}><option value="">Sin responsable</option>{activeProfiles.map(p=><option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}</select>
      <input className="input" type="date" value={due} onChange={e=>setDue(e.target.value)}/><select className="select" value={priority} onChange={e=>setPriority(e.target.value as typeof priority)}><option value="high">Alta</option><option value="medium">Media</option><option value="low">Baja</option></select><button className="btn" type="submit">Crear ticket</button>
    </form></div>
    <div className="toolbar"><input className="input" style={{maxWidth:330}} placeholder="Buscar tickets" value={query} onChange={e=>setQuery(e.target.value)}/><select className="select" style={{maxWidth:230}} value={department} onChange={e=>setDepartment(e.target.value)}><option value="all">Todos los departamentos</option>{state.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
    <div className="card">{visible.map(ticket=><TicketRow key={ticket.id} ticket={ticket} depName={state.departments.find(d=>d.id===ticket.departmentId)?.name} ownerName={state.profiles.find(p=>p.id===ticket.ownerId)?.name} subtasks={state.subtasks.filter(s=>s.ticketId===ticket.id)} activeProfiles={activeProfiles} toggleSubtask={toggleSubtask} addSubtask={addSubtask} rescheduleTicket={rescheduleTicket} closeTicket={closeTicket} reopenTicket={reopenTicket}/>)}</div>
  </>;
}

function TicketRow(props:any){
  const {ticket,depName,ownerName,subtasks,activeProfiles,toggleSubtask,addSubtask,rescheduleTicket,closeTicket,reopenTicket}=props;
  const [subtask,setSubtask]=useState(""); const [subOwner,setSubOwner]=useState(""); const [evidence,setEvidence]=useState(""); const [date,setDate]=useState(ticket.dueDate||""); const [error,setError]=useState("");
  return <div className="ticket"><div><h3>#{ticket.number} · {ticket.title}</h3><div className="meta"><span>{depName}</span><span>{ownerName||"Sin responsable"}</span><span>{ticket.priority}</span>{ticket.dueDate?<span>vence {ticket.dueDate}</span>:null}{ticket.blocker?<span className="pill blocked">Bloqueo</span>:null}{ticket.decisionNeeded?<span className="pill decision">Decisión</span>:null}{ticket.status==="done"?<span className="pill done">Cerrado</span>:null}</div>
    <div className="subtasks">{subtasks.map((s:any)=><label className={`subtask ${s.done?"done":""}`} key={s.id}><input type="checkbox" checked={s.done} onChange={()=>toggleSubtask(s.id)}/><span>{s.title}</span></label>)}<div className="row"><input className="input" placeholder="Nueva subtarea" value={subtask} onChange={e=>setSubtask(e.target.value)}/><select className="select" style={{maxWidth:200}} value={subOwner} onChange={e=>setSubOwner(e.target.value)}><option value="">Responsable</option>{activeProfiles.map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button className="btn secondary" onClick={()=>{if(!subtask.trim())return;addSubtask(ticket.id,subtask.trim(),subOwner||undefined);setSubtask("");}}>Agregar</button></div></div>
  </div><div className="stack" style={{width:240,maxWidth:"100%"}}><div className="row"><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/><button className="btn secondary" onClick={()=>date&&rescheduleTicket(ticket.id,date)}>Fecha</button></div>{ticket.status==="open"?<><textarea className="textarea" placeholder="Evidencia / reporte de cierre" value={evidence} onChange={e=>setEvidence(e.target.value)}/>{error?<small style={{color:"var(--danger)"}}>{error}</small>:null}<button className="btn" onClick={()=>{const result=closeTicket(ticket.id,evidence);if(!result.ok)setError(result.error||"No se pudo cerrar");else{setError("");setEvidence("");}}}>Cerrar ticket</button></>:<button className="btn secondary" onClick={()=>reopenTicket(ticket.id)}>Reabrir ticket</button>}</div></div>;
}
