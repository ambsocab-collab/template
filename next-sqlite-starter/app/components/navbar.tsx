import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      {/* Logo/Brand */}
      <Link
        href="/"
        className="text-xl font-bold text-gray-900 dark:text-white"
      >
        next-sqlite-starter
      </Link>

      {/* Right side: Auth links and theme toggle */}
      <div className="flex items-center gap-4">
        {userId ? (
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}
