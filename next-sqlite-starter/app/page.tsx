import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Database, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Build faster with next-sqlite-starter
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            All you need for a modern SaaS in one template
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Authentication */}
            <Card className="p-6 dark:border-gray-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Pre-built Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Clerk integration with email, password, and OAuth ready
              </p>
            </Card>

            {/* Feature 2: Database */}
            <Card className="p-6 dark:border-gray-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 mb-4">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Database Ready
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                SQLite with Drizzle ORM for type-safe queries
              </p>
            </Card>

            {/* Feature 3: Stripe */}
            <Card className="p-6 dark:border-gray-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 mb-4">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Stripe Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Payments and subscriptions pre-configured
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
