import { OsShell } from "@/components/os-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <OsShell>{children}</OsShell>;
}
