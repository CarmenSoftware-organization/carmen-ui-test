import Link from 'next/link'

export default function LayoutsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Layout Components</h1>

        {/* Grid Layout */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Grid Layout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
              >
                <h3 className="font-semibold mb-2">Grid Item {item}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Responsive grid column
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Flex Layout */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Flex Layout</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Flex Item 1</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Flexible layout item
              </p>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Flex Item 2</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Flexible layout item
              </p>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Flex Item 3</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Flexible layout item
              </p>
            </div>
          </div>
        </section>

        {/* Sidebar Layout */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sidebar Layout</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <aside className="md:w-64 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Sidebar</h3>
              <nav className="space-y-2">
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  Menu Item 1
                </a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  Menu Item 2
                </a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  Menu Item 3
                </a>
              </nav>
            </aside>
            <main className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Main Content</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This is the main content area with a sidebar navigation
              </p>
            </main>
          </div>
        </section>
      </div>
    </div>
  )
}
