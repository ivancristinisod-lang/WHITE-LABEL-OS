export type Department = { id: string; name: string; key: string };
export type Profile = { id: string; name: string; role: string; active: boolean };
export type Subtask = { id: string; ticketId: string; title: string; done: boolean; ownerId?: string };
export type TicketStatus = "open" | "done";
export type Ticket = {
  id: string;
  number: number;
  title: string;
  description?: string;
  departmentId: string;
  ownerId?: string;
  dueDate?: string;
  blocker?: string;
  decisionNeeded?: string;
  nextAction?: string;
  status: TicketStatus;
  priority: "high" | "medium" | "low";
  evidence?: string;
  version: number;
  createdAt: string;
  closedAt?: string;
};
export type AuditEvent = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string;
  createdAt: string;
  detail: string;
};
export type InboxMessage = {
  id: string;
  from: string;
  to: string;
  message: string;
  createdAt: string;
};
export type AppState = {
  organization: { id: string; name: string; productName: string; undoSeconds: number; requireClosureEvidence: boolean };
  departments: Department[];
  profiles: Profile[];
  tickets: Ticket[];
  subtasks: Subtask[];
  audit: AuditEvent[];
  inbox: InboxMessage[];
};
