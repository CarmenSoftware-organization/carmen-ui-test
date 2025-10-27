import Link from 'next/link'

export default function ComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8">UI Components</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="space-y-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Primary Button
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 ml-2">
              Secondary Button
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold">Card Title</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is a sample card component
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
          <input
            type="text"
            placeholder="Enter text..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <div className="space-x-2">
            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
              Info
            </span>
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
              Success
            </span>
            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
              Error
            </span>
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p className="font-bold">Warning</p>
            <p className="text-sm">This is a warning alert</p>
          </div>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Loading</h2>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
