export default async function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Your profile page will be implemented in future stories.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>View and edit profile information</li>
          <li>Update avatar and display name</li>
          <li>Manage account preferences</li>
        </ul>
      </div>
    </div>
  );
}
