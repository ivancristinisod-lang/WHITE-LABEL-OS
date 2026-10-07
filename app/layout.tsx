import type { Metadata } from "next";
import "./globals.css";
import { DemoStoreProvider } from "@/components/demo-store";

export const metadata: Metadata = {
  title: "OS",
  description: "Task-first multi-tenant operating system"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <DemoStoreProvider>{children}</DemoStoreProvider>
      </body>
    </html>
  );
}
