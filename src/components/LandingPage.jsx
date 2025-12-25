import { Shield, Key, Users, Lock, Fingerprint, Network } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: "Enterprise SSO",
    description: "Single Sign-On across all your applications with industry-standard protocols"
  },
  {
    icon: Users,
    title: "Identity Federation",
    description: "Connect to LDAP, Active Directory, or social identity providers"
  },
  {
    icon: Lock,
    title: "Fine-grained Authorization",
    description: "Role-based and group-based access control for your resources"
  },
  {
    icon: Key,
    title: "OAuth 2.0 & OIDC",
    description: "Modern authentication protocols with JWT tokens"
  },
  {
    icon: Fingerprint,
    title: "Multi-Factor Auth",
    description: "Enhanced security with configurable MFA policies"
  },
  {
    icon: Network,
    title: "User Federation",
    description: "Sync users from external sources like Active Directory"
  }
]

export default function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen animated-bg text-white overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rhbk-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rhbk-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rhbk-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rhbk-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 100 100">
                <path d="M35 30 L50 50 L35 70 M50 50 L65 30 M50 50 L65 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg">RHBK Demo</h1>
              <p className="text-xs text-gray-400">Red Hat Build of Keycloak</p>
            </div>
          </div>
          
          <button 
            onClick={onLogin}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-8 pt-16 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-24 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rhbk-500/10 border border-rhbk-500/30 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Enterprise Identity Management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Secure Your Apps with
              <br />
              <span className="gradient-text">Red Hat Keycloak</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              Experience enterprise-grade identity and access management. 
              This demo showcases OIDC authentication, role-based access control, 
              and JWT token handling.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onLogin}
                className="group px-8 py-4 bg-rhbk-500 hover:bg-rhbk-600 rounded-xl font-semibold text-lg transition-all hover:scale-105 glow-red flex items-center gap-3"
              >
                <Key className="w-5 h-5" />
                Login with RHBK
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <a 
                href="https://access.redhat.com/products/red-hat-build-of-keycloak"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-xl font-semibold text-lg transition-all hover:bg-white/5"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-rhbk-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-rhbk-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* OIDC Flow Diagram */}
          <div className="mt-24 glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">How OIDC Authentication Works</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
              {/* User */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-10 h-10 text-blue-400" />
                </div>
                <p className="font-medium">User</p>
                <p className="text-xs text-gray-500">Browser</p>
              </div>
              
              {/* Arrow 1 */}
              <div className="hidden md:flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-2">1. Login Request</p>
                <svg className="w-24 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 100 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h85m0 0l-8-8m8 8l-8 8" />
                </svg>
              </div>
              
              {/* RHBK */}
              <div className="text-center">
                <div className="w-20 h-20 bg-rhbk-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 glow-red">
                  <Key className="w-10 h-10 text-rhbk-500" />
                </div>
                <p className="font-medium">RHBK</p>
                <p className="text-xs text-gray-500">Identity Provider</p>
              </div>
              
              {/* Arrow 2 */}
              <div className="hidden md:flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-2">2. JWT Token</p>
                <svg className="w-24 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 100 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h85m0 0l-8-8m8 8l-8 8" />
                </svg>
              </div>
              
              {/* App */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-10 h-10 text-green-400" />
                </div>
                <p className="font-medium">Application</p>
                <p className="text-xs text-gray-500">Protected Resource</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>Demo Application for Red Hat Build of Keycloak</p>
        </div>
      </footer>
    </div>
  )
}

