"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
