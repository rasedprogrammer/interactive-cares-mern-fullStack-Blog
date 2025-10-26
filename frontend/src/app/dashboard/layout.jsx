import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <UserSidebar
        firstName="John"
        lastName="Doe"
        email="john@example.com"
        role="Admin"
      />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b border-muted/30 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
