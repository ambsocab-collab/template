"use client";

import { ThemeToggle } from "./theme-toggle";
import { UserDropdown } from "./user-dropdown";
import { MobileNav } from "./mobile-nav";

export function DashboardNavbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* Left side: Mobile Nav (hamburger) */}
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* Right side: Theme toggle and User avatar */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserDropdown />
      </div>
    </nav>
  );
}
