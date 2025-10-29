import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { DashboardErrorBoundary } from "@/components/DashboardErrorBoundary";
import { Sidebar } from "../components/sidebar";
import { DashboardNavbar } from "../components/dashboard-navbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardErrorBoundary>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
}
