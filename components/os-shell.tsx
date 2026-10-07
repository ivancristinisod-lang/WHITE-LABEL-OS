"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoStore } from "./demo-store";

const nav = [
  ["Panel General", "/dashboard"],
  ["Recordatorios", "/dashboard?filter=today"],
  ["Tickets", "/tickets"],
  ["Departamentos", "/departments"],
  ["Inbox", "/inbox"],
  ["Historial", "/history"],
  ["Archivo", "/archive"],
  ["Equipo", "/team"],
  ["Configuración", "/settings/general"]
] as const;

export function OsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useDemoStore();
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">{state.organization.productName}</div>
        <nav className="nav">
          <div className="nav-section">Operación</div>
          {nav.map(([label, href]) => <Link key={href} href={href} data-active={pathname === href.split("?")[0]}>{label}</Link>)}
          <div className="nav-section">Departamentos</div>
          {state.departments.map(dep => <Link key={dep.id} href={`/departments?department=${dep.id}`}>{dep.name}</Link>)}
        </nav>
      </aside>
      <main className="main"><div className="page">{children}</div></main>
    </div>
  );
}
