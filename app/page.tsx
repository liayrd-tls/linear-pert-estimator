import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Linear PERT Estimator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Three-point estimation and visualization for Linear tasks and projects.
          Make better predictions with PERT methodology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/api/auth/login"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Connect Linear
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">PERT Estimation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use optimistic, most likely, and pessimistic estimates for accurate project planning.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Minimal Visualization</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clean, distraction-free charts that focus on what matters.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Linear Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seamless integration with your Linear workspace and projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
