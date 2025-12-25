import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp, FileJson } from 'lucide-react'

const colorClasses = {
  purple: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    icon: 'text-purple-500',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: 'text-cyan-500',
  },
}

// Syntax highlight JSON
function highlightJSON(obj, indent = 0) {
  if (obj === null) return <span className="null">null</span>
  if (typeof obj === 'boolean') return <span className="boolean">{obj.toString()}</span>
  if (typeof obj === 'number') return <span className="number">{obj}</span>
  if (typeof obj === 'string') return <span className="string">"{obj}"</span>
  
  const spaces = '  '.repeat(indent)
  const nextSpaces = '  '.repeat(indent + 1)
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return (
      <>
        {'[\n'}
        {obj.map((item, i) => (
          <span key={i}>
            {nextSpaces}{highlightJSON(item, indent + 1)}
            {i < obj.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {spaces}{']'}
      </>
    )
  }
  
  if (typeof obj === 'object') {
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'
    return (
      <>
        {'{\n'}
        {entries.map(([key, value], i) => (
          <span key={key}>
            {nextSpaces}<span className="key">"{key}"</span>: {highlightJSON(value, indent + 1)}
            {i < entries.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {spaces}{'}'}
      </>
    )
  }
  
  return String(obj)
}

export default function TokenViewer({ title, subtitle, token, decoded, color = 'purple' }) {
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(true)
  
  const colors = colorClasses[color] || colorClasses.purple

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Extract token parts
  const tokenParts = token?.split('.') || []

  return (
    <div className={`glass rounded-2xl overflow-hidden ${colors.border} border`}>
      {/* Header */}
      <div 
        className={`p-4 ${colors.bg} cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
              <FileJson className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {/* Token Structure Info */}
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">JWT Structure (Header.Payload.Signature)</p>
            <div className="flex gap-1 font-mono text-xs overflow-x-auto">
              <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded">Header</span>
              <span className="text-gray-600">.</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Payload</span>
              <span className="text-gray-600">.</span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Signature</span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowRaw(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                !showRaw ? `${colors.bg} ${colors.text}` : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Decoded
            </button>
            <button
              onClick={() => setShowRaw(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showRaw ? `${colors.bg} ${colors.text}` : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Raw JWT
            </button>
            
            <div className="flex-1"></div>
            
            <button
              onClick={() => copyToClipboard(showRaw ? token : JSON.stringify(decoded, null, 2))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Token Content */}
          <div className="token-viewer bg-surface-950 rounded-xl p-4 overflow-x-auto max-h-96 overflow-y-auto">
            {showRaw ? (
              <pre className="text-xs font-mono break-all whitespace-pre-wrap">
                <span className="text-pink-400">{tokenParts[0]}</span>
                <span className="text-gray-600">.</span>
                <span className="text-green-400">{tokenParts[1]}</span>
                <span className="text-gray-600">.</span>
                <span className="text-blue-400">{tokenParts[2]}</span>
              </pre>
            ) : (
              <pre className="text-xs font-mono whitespace-pre">
                {decoded ? highlightJSON(decoded) : 'No token data'}
              </pre>
            )}
          </div>

          {/* Key Claims Info */}
          {decoded && !showRaw && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {decoded.exp && (
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-sm font-mono truncate">
                    {new Date(decoded.exp * 1000).toLocaleTimeString()}
                  </p>
                </div>
              )}
              {decoded.iat && (
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-500">Issued At</p>
                  <p className="text-sm font-mono truncate">
                    {new Date(decoded.iat * 1000).toLocaleTimeString()}
                  </p>
                </div>
              )}
              {decoded.iss && (
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-500">Issuer</p>
                  <p className="text-sm font-mono truncate" title={decoded.iss}>
                    {decoded.iss.split('/').pop()}
                  </p>
                </div>
              )}
              {decoded.azp && (
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-mono truncate">{decoded.azp}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

