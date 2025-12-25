import { User, Key, Shield, ArrowRight, Check } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: "User Initiates Login",
    description: "User clicks 'Login' and is redirected to RHBK",
    icon: User,
    color: "blue",
  },
  {
    number: 2,
    title: "RHBK Authenticates",
    description: "User enters credentials at RHBK login page",
    icon: Key,
    color: "red",
  },
  {
    number: 3,
    title: "Authorization Code",
    description: "RHBK redirects back with an authorization code",
    icon: ArrowRight,
    color: "purple",
  },
  {
    number: 4,
    title: "Token Exchange",
    description: "App exchanges code for access & ID tokens",
    icon: Shield,
    color: "green",
  },
  {
    number: 5,
    title: "Access Granted",
    description: "User is authenticated with JWT tokens",
    icon: Check,
    color: "emerald",
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  red: { bg: 'bg-rhbk-500/20', text: 'text-rhbk-400', border: 'border-rhbk-500/30' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
}

export default function OIDCFlowCard() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">OpenID Connect Authorization Code Flow</h3>
          <p className="text-xs text-gray-400">The authentication flow you just completed</p>
        </div>
      </div>

      {/* Flow Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-500/50 via-rhbk-500/50 to-green-500/50 hidden md:block"></div>
        
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((step, index) => {
            const colors = colorMap[step.color]
            return (
              <div 
                key={step.number}
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Step Circle */}
                <div className={`
                  w-16 h-16 ${colors.bg} ${colors.border} border-2 
                  rounded-2xl mx-auto mb-4 flex items-center justify-center
                  relative z-10 bg-surface-900
                `}>
                  <step.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                
                {/* Step Number */}
                <div className={`
                  absolute -top-2 -right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 md:-top-3
                  w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center
                  text-xs font-bold ${colors.text} border ${colors.border}
                `}>
                  {step.number}
                </div>
                
                {/* Step Info */}
                <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="font-medium mb-4">Technical Details</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">Authorization Endpoint</p>
            <code className="text-sm text-rhbk-400 font-mono break-all">
              /realms/ocp/protocol/openid-connect/auth
            </code>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">Token Endpoint</p>
            <code className="text-sm text-green-400 font-mono break-all">
              /realms/ocp/protocol/openid-connect/token
            </code>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">UserInfo Endpoint</p>
            <code className="text-sm text-blue-400 font-mono break-all">
              /realms/ocp/protocol/openid-connect/userinfo
            </code>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400 mb-2">End Session Endpoint</p>
            <code className="text-sm text-purple-400 font-mono break-all">
              /realms/ocp/protocol/openid-connect/logout
            </code>
          </div>
        </div>
      </div>

      {/* OIDC Discovery */}
      <div className="mt-4 p-4 bg-rhbk-500/10 border border-rhbk-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-rhbk-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-rhbk-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">
              <strong>Discovery Document:</strong> All OIDC endpoints are published at:
            </p>
            <code className="text-xs text-rhbk-400 font-mono">
              /.well-known/openid-configuration
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

