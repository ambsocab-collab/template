export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Your settings page will be implemented in future stories.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Application preferences</li>
          <li>Notification settings</li>
          <li>Privacy and security options</li>
          <li>Subscription management</li>
        </ul>
      </div>
    </div>
  );
}
