import { useAuth } from 'react-oidc-context'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const auth = useAuth()

  // Handle loading state
  if (auth.isLoading) {
    return <LoadingScreen message="Connecting to RHBK..." />
  }

  // Handle authentication errors
  if (auth.error) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Error</h2>
          <p className="text-gray-400 mb-6">{auth.error.message}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => {
                sessionStorage.clear()
                window.location.href = '/'
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
            >
              Clear & Retry
            </button>
            <button 
              onClick={() => auth.signinRedirect()}
              className="px-6 py-3 bg-rhbk-500 hover:bg-rhbk-600 text-white rounded-xl font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show landing page if not authenticated
  if (!auth.isAuthenticated) {
    return <LandingPage onLogin={() => auth.signinRedirect()} />
  }

  // Show dashboard if authenticated
  return <Dashboard />
}

export default App
