"use server";

import { SignOutButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  // Auth is guaranteed by DashboardLayout - no need to check again
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Your Dashboard!
          </h2>
          <p className="text-slate-600">
            You&apos;re successfully authenticated with Clerk.
          </p>
        </div>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          User Information
        </h3>
        <p className="text-sm text-slate-600">
          User is authenticated and can securely access dashboard content.
        </p>
      </div>
    </div>
  );
}
