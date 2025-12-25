export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-rhbk-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rhbk-500 animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-rhbk-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-rhbk-500" viewBox="0 0 100 100">
              <path d="M35 30 L50 50 L35 70 M50 50 L65 30 M50 50 L65 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>
        <p className="text-gray-500">Red Hat Build of Keycloak</p>
      </div>
    </div>
  )
}

