export default async function DashboardPage() {
  // Auth is guaranteed by DashboardLayout - no need to check again
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard!</h2>
        <p className="text-muted-foreground">
          You&apos;re successfully authenticated with Clerk.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        <p className="text-sm text-muted-foreground">
          User is authenticated and can securely access dashboard content.
        </p>
      </div>
    </div>
  );
}
