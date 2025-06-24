import { ClientSidebar, MobileSidebar } from "@/components";
import { AdminAuthWrapper } from "@/providers/UserContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthWrapper>
      <div className="admin-layout">
        <MobileSidebar />
        <aside className="hidden w-full max-w-[270px] lg:block">
          <ClientSidebar width={270} enableGestures={false} />
        </aside>

        <aside className="children">{children}</aside>
      </div>
    </AdminAuthWrapper>
  );
}
