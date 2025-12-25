import { Lock, Check, X } from 'lucide-react'

const colorClasses = {
  red: {
    bg: 'bg-rhbk-500/20',
    border: 'border-rhbk-500/30',
    text: 'text-rhbk-400',
    glow: 'glow-red',
    icon: 'text-rhbk-500',
    badge: 'bg-rhbk-500/20 text-rhbk-400',
  },
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'glow-blue',
    icon: 'text-blue-500',
    badge: 'bg-blue-500/20 text-blue-400',
  },
  green: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'glow-green',
    icon: 'text-green-500',
    badge: 'bg-green-500/20 text-green-400',
  },
  purple: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'glow-purple',
    icon: 'text-purple-500',
    badge: 'bg-purple-500/20 text-purple-400',
  },
}

export default function RoleBasedSection({ 
  title, 
  description, 
  icon: Icon, 
  color = 'blue',
  hasAccess,
  requiredRole 
}) {
  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div 
      className={`
        glass rounded-2xl p-6 transition-all duration-300
        ${hasAccess ? `hover:${colors.bg} cursor-pointer` : 'opacity-60'}
        ${hasAccess ? colors.glow : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        
        {hasAccess ? (
          <span className={`px-3 py-1 ${colors.badge} rounded-full text-xs font-medium flex items-center gap-1`}>
            <Check className="w-3 h-3" />
            Access Granted
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Restricted
          </span>
        )}
      </div>

      {/* Content */}
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      {/* Required Role */}
      <div className={`
        p-3 rounded-lg border
        ${hasAccess ? `${colors.bg} ${colors.border}` : 'bg-white/5 border-white/10'}
      `}>
        <p className="text-xs text-gray-400 mb-1">Required:</p>
        <p className={`text-sm font-mono ${hasAccess ? colors.text : 'text-gray-500'}`}>
          {requiredRole}
        </p>
      </div>

      {/* Access content preview */}
      {hasAccess && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <Check className={`w-4 h-4 ${colors.text}`} />
            <span className={colors.text}>You have access to this section</span>
          </div>
          
          {/* Mock content */}
          <div className="mt-3 space-y-2">
            <div className="h-2 bg-white/10 rounded w-full"></div>
            <div className="h-2 bg-white/10 rounded w-3/4"></div>
            <div className="h-2 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      )}

      {/* Locked overlay */}
      {!hasAccess && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <X className="w-4 h-4" />
            <span>Join the required group to access</span>
          </div>
        </div>
      )}
    </div>
  )
}

