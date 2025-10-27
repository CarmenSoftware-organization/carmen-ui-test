import Link from 'next/link'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">Component Examples</h1>

      <div className="space-y-12">
        {/* Button Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Card title="Button Variants">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>

              <div className="max-w-md">
                <Button variant="primary" fullWidth>
                  Full Width Button
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Card Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="default" title="Default Card">
              <p className="text-gray-600 dark:text-gray-400">
                This is a default card with a title and basic styling.
              </p>
            </Card>

            <Card variant="bordered" title="Bordered Card">
              <p className="text-gray-600 dark:text-gray-400">
                This card has a visible border around it.
              </p>
            </Card>

            <Card variant="elevated" title="Elevated Card">
              <p className="text-gray-600 dark:text-gray-400">
                This card has a shadow to create elevation.
              </p>
            </Card>

            <Card
              title="Card with Footer"
              footer={
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Confirm
                  </Button>
                </div>
              }
            >
              <p className="text-gray-600 dark:text-gray-400">
                This card includes a footer section with actions.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-2">No Title Card</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cards can also be created without a title section.
              </p>
            </Card>

            <Card
              variant="bordered"
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900"
            >
              <h3 className="text-lg font-semibold mb-2">Custom Styling</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You can add custom classes for unique styling.
              </p>
            </Card>
          </div>
        </section>

        {/* Combined Example */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Combined Example</h2>
          <Card
            variant="elevated"
            title="User Profile"
            footer={
              <div className="flex gap-3">
                <Button variant="outline" size="sm" fullWidth>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" fullWidth>
                  Save Changes
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
