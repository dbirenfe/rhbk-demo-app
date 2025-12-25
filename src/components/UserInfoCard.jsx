import { User, Mail, Clock, Fingerprint, Globe, Calendar } from 'lucide-react'

export default function UserInfoCard({ user, idToken, accessToken }) {
  const profile = user?.profile || {}
  
  // Get auth_time from ID token (more reliable than profile)
  const authTime = idToken?.auth_time || profile.auth_time
  const tokenExpiry = accessToken?.exp
  
  const infoItems = [
    { icon: User, label: "Username", value: profile.preferred_username },
    { icon: User, label: "Full Name", value: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Fingerprint, label: "Subject ID", value: profile.sub?.slice(0, 16) + '...' },
    { icon: Globe, label: "Realm", value: idToken?.iss?.split('/').pop() || profile.iss?.split('/').pop() },
    { icon: Clock, label: "Auth Time", value: authTime ? new Date(authTime * 1000).toLocaleTimeString() : 'N/A' },
    { icon: Calendar, label: "Token Expires", value: tokenExpiry ? new Date(tokenExpiry * 1000).toLocaleTimeString() : 'N/A' },
  ]

  return (
    <div className="glass rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold">User Profile</h3>
          <p className="text-xs text-gray-400">Identity information from RHBK</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-rhbk-500 to-rhbk-700 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg glow-red">
          {profile.given_name?.[0]}{profile.family_name?.[0] || profile.preferred_username?.[0]}
        </div>
      </div>

      {/* Info List */}
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-medium truncate">{item.value || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Email Verified Badge */}
      {profile.email_verified && (
        <div className="mt-6 flex items-center justify-center gap-2 py-2 bg-green-500/10 rounded-lg">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-green-400">Email Verified</span>
        </div>
      )}
    </div>
  )
}
