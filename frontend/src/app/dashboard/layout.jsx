import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user-sideber";

import { Separator } from "@radix-ui/react-dropdown-menu";

import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  // const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/singin");
  // }

  return (
    <SidebarProvider className={""}>
      <UserSidebar
        firstName={"firstName"}
        lastName={"lastName"}
        email={"email"}
        role={"role"}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {/* <SidebarTrigger className="" /> */}
            <Separator orientation="vertical" className="mr-2 h-4 " />
            {/* <AppBreadcrumb /> */}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
