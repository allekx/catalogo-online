import { AdminShell } from "@/components/admin/layout/AdminShell";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
