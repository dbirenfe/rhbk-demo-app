import { useState, useEffect } from 'react'
import { Link2, Database, KeyRound, ExternalLink, Check, User, RefreshCw, LinkIcon } from 'lucide-react'

// SVG Icons for popular identity providers
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
)

const GitLabIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fill="#E24329" d="m12 22.2 4.07-12.52H7.93z"/>
    <path fill="#FC6D26" d="m12 22.2-4.07-12.52H1.64L12 22.2z"/>
    <path fill="#FCA326" d="m1.64 9.68-1.27 3.9a.87.87 0 0 0 .31.97L12 22.2 1.64 9.68z"/>
    <path fill="#E24329" d="M1.64 9.68h6.29L5.08 1.86a.43.43 0 0 0-.82 0L1.64 9.68z"/>
    <path fill="#FC6D26" d="m12 22.2 4.07-12.52h6.29L12 22.2z"/>
    <path fill="#FCA326" d="m22.36 9.68 1.27 3.9a.87.87 0 0 1-.31.97L12 22.2l10.36-12.52z"/>
    <path fill="#E24329" d="M22.36 9.68h-6.29l2.85-7.82a.43.43 0 0 1 .82 0l2.62 7.82z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="#0A66C2" className="w-6 h-6">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const OktaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <circle fill="#007DC1" cx="12" cy="12" r="10"/>
    <path fill="white" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
  </svg>
)

const SAMLIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)

const LDAPIcon = () => (
  <Database className="w-6 h-6" />
)

const KeycloakIcon = () => (
  <KeyRound className="w-6 h-6" />
)

const DefaultIcon = () => (
  <LinkIcon className="w-6 h-6" />
)

// Map IdP types to display info
const idpConfig = {
  'github': { name: 'GitHub', Icon: GitHubIcon, color: 'purple', type: 'Social' },
  'google': { name: 'Google', Icon: GoogleIcon, color: 'red', type: 'Social' },
  'google-oidc': { name: 'Google', Icon: GoogleIcon, color: 'red', type: 'Social' },
  'microsoft': { name: 'Microsoft', Icon: MicrosoftIcon, color: 'cyan', type: 'OIDC' },
  'entra-id': { name: 'Microsoft Entra ID', Icon: MicrosoftIcon, color: 'cyan', type: 'OIDC' },
  'azure-ad': { name: 'Azure AD', Icon: MicrosoftIcon, color: 'cyan', type: 'OIDC' },
  'gitlab': { name: 'GitLab', Icon: GitLabIcon, color: 'orange', type: 'Social' },
  'facebook': { name: 'Facebook', Icon: FacebookIcon, color: 'blue', type: 'Social' },
  'linkedin': { name: 'LinkedIn', Icon: LinkedInIcon, color: 'blue', type: 'Social' },
  'linkedin-openid-connect': { name: 'LinkedIn', Icon: LinkedInIcon, color: 'blue', type: 'Social' },
  'okta': { name: 'Okta', Icon: OktaIcon, color: 'blue', type: 'OIDC' },
  'twitter': { name: 'Twitter/X', Icon: DefaultIcon, color: 'gray', type: 'Social' },
  'ldap': { name: 'LDAP / Active Directory', Icon: LDAPIcon, color: 'amber', type: 'LDAP' },
  'kerberos': { name: 'Kerberos', Icon: KeycloakIcon, color: 'orange', type: 'Kerberos' },
  'saml': { name: 'SAML IdP', Icon: SAMLIcon, color: 'indigo', type: 'SAML' },
  'oidc': { name: 'OIDC Provider', Icon: DefaultIcon, color: 'indigo', type: 'OIDC' },
}

const colorClasses = {
  green: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', icon: 'text-green-500', ring: 'ring-green-500' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', icon: 'text-amber-500', ring: 'ring-amber-500' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', icon: 'text-blue-500', ring: 'ring-blue-500' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-400', icon: 'text-cyan-500', ring: 'ring-cyan-500' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', icon: 'text-red-500', ring: 'ring-red-500' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', icon: 'text-purple-500', ring: 'ring-purple-500' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', icon: 'text-orange-500', ring: 'ring-orange-500' },
  gray: { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400', icon: 'text-gray-500', ring: 'ring-gray-500' },
  indigo: { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400', icon: 'text-indigo-500', ring: 'ring-indigo-500' },
}

export default function IdentitySourceCard({ idToken, accessToken, profile, accessTokenRaw }) {
  const [linkedAccounts, setLinkedAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Get identity provider used for THIS login from token claims
  // Check multiple possible claim names
  const identityProvider = idToken?.identity_provider || 
                           idToken?.identityProvider ||
                           idToken?.idp ||
                           accessToken?.identity_provider || 
                           accessToken?.identityProvider ||
                           accessToken?.idp ||
                           null
                           
  const identityProviderIdentity = idToken?.identity_provider_identity || 
                                    accessToken?.identity_provider_identity || 
                                    null
  
  // Get issuer (Keycloak realm URL)
  const issuer = idToken?.iss || accessToken?.iss || null
  const realmName = issuer ? issuer.split('/realms/')[1] : null
  
  // Check for LDAP indicators
  const ldapId = profile?.LDAP_ID || idToken?.LDAP_ID || accessToken?.LDAP_ID
  const ldapEntryDN = profile?.LDAP_ENTRY_DN || idToken?.LDAP_ENTRY_DN || accessToken?.LDAP_ENTRY_DN
  
  // Account console URL for managing linked accounts
  const accountConsoleUrl = issuer ? `${issuer}/account/account-security/linked-accounts` : null
  
  // Debug: log what we're detecting
  useEffect(() => {
    console.log('=== Identity Provider Detection ===')
    console.log('idToken claims:', idToken)
    console.log('accessToken claims:', accessToken)
    console.log('Detected identityProvider:', identityProvider)
    console.log('================================')
  }, [idToken, accessToken, identityProvider])
  
  // Fetch linked accounts from Keycloak Account API
  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (!issuer || !accessTokenRaw) {
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`${issuer}/account/linked-accounts`, {
          headers: {
            'Authorization': `Bearer ${accessTokenRaw}`,
            'Accept': 'application/json'
          }
        })
        
        if (response.ok) {
          const accounts = await response.json()
          console.log('Linked accounts from API:', accounts)
          setLinkedAccounts(accounts)
        } else {
          console.warn('Could not fetch linked accounts:', response.status)
        }
      } catch (err) {
        console.warn('Error fetching linked accounts:', err)
      }
      
      setLoading(false)
    }
    
    fetchLinkedAccounts()
  }, [issuer, accessTokenRaw])
  
  // Build list of all identity sources
  const identityLinks = []
  
  // Determine if Keycloak local is active (no IdP used)
  const isKeycloakActive = !identityProvider && !ldapId
  
  // Always add Keycloak as primary source
  identityLinks.push({
    id: 'keycloak',
    name: realmName ? `Keycloak (${realmName})` : 'Keycloak',
    alias: 'local',
    type: 'Primary',
    Icon: KeycloakIcon,
    color: 'green',
    identity: profile?.preferred_username || idToken?.preferred_username || idToken?.sub,
    isActive: isKeycloakActive,
    isLinked: true,
    details: issuer || 'Local authentication',
    linkUrl: null // Can't link to itself
  })
  
  // Add LDAP if detected in token
  if (ldapId || ldapEntryDN) {
    identityLinks.push({
      id: 'ldap',
      name: 'Active Directory / LDAP',
      alias: 'ldap',
      type: 'Federation',
      Icon: LDAPIcon,
      color: 'amber',
      identity: ldapEntryDN || ldapId,
      isActive: !identityProvider && !!ldapId,
      isLinked: true,
      details: ldapEntryDN || 'LDAP user store',
      linkUrl: null
    })
  }
  
  // Add linked accounts from API
  linkedAccounts.forEach(account => {
    const alias = account.providerAlias?.toLowerCase() || account.providerName?.toLowerCase()
    const config = idpConfig[alias] || {
      name: account.displayName || account.providerAlias || account.providerName,
      Icon: DefaultIcon,
      color: 'indigo',
      type: 'Federation'
    }
    
    // Check if this IdP was used for login
    const isThisActive = identityProvider?.toLowerCase() === alias ||
                         identityProvider?.toLowerCase() === account.providerAlias?.toLowerCase()
    
    const isLinked = account.connected !== false && account.linkedUsername
    
    identityLinks.push({
      id: account.providerAlias || account.providerName,
      name: config.name || account.displayName || account.providerAlias,
      alias: account.providerAlias,
      type: config.type || 'Social',
      Icon: config.Icon,
      color: config.color,
      identity: account.linkedUsername || account.userName,
      socialUserId: account.socialUserId,
      isActive: isThisActive,
      isLinked,
      details: isLinked 
        ? `Linked as ${account.linkedUsername}` 
        : 'Not linked',
      // Use Account Console for linking (deprecated broker endpoint removed)
      linkUrl: !isLinked ? accountConsoleUrl : null
    })
  })
  
  // If we got identity_provider from token but it's not in linked accounts, add it
  if (identityProvider && !identityLinks.find(l => l.alias?.toLowerCase() === identityProvider.toLowerCase())) {
    const config = idpConfig[identityProvider.toLowerCase()] || {
      name: identityProvider,
      Icon: DefaultIcon,
      color: 'indigo',
      type: 'Federation'
    }
    
    identityLinks.push({
      id: identityProvider,
      name: config.name,
      alias: identityProvider,
      type: config.type || 'Federation',
      Icon: config.Icon,
      color: config.color,
      identity: identityProviderIdentity || profile?.email,
      isActive: true,
      isLinked: true,
      details: `Federated via ${config.type || 'OIDC'}`,
      linkUrl: null
    })
  }
  
  // Find the active source (the one used for this login)
  const activeSource = identityLinks.find(l => l.isActive) || identityLinks[0]
  
  // Count linked accounts
  const linkedCount = identityLinks.filter(l => l.isLinked).length

  return (
    <div className="glass rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <Link2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold">Identity Sources</h3>
            <p className="text-xs text-gray-400">Your linked accounts & auth source</p>
          </div>
        </div>
        {accountConsoleUrl && (
          <a 
            href={accountConsoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Manage <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
          <span className="ml-2 text-gray-400">Loading linked accounts...</span>
        </div>
      )}

      {/* Identity Links */}
      {!loading && (
        <div className="space-y-3">
          {identityLinks.map((link) => {
            const colors = colorClasses[link.color] || colorClasses.gray
            const IconComponent = link.Icon
            
            const cardContent = (
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  link.isActive || link.isLinked ? colors.bg : 'bg-white/10'
                }`}>
                  <div className={link.isActive || link.isLinked ? colors.icon : 'text-gray-400'}>
                    <IconComponent />
                  </div>
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold ${link.isActive ? colors.text : link.isLinked ? 'text-gray-200' : 'text-gray-400'}`}>
                      {link.name}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      link.isActive ? `${colors.bg} ${colors.text}` : 'bg-white/10 text-gray-400'
                    }`}>
                      {link.type}
                    </span>
                  </div>
                  
                  {/* Identity/Username at this source */}
                  {link.identity && (
                    <div className="mt-1 flex items-center gap-2">
                      <User className="w-3 h-3 text-gray-500" />
                      <p className="text-sm text-gray-400 truncate font-mono">
                        {link.identity}
                      </p>
                    </div>
                  )}
                  
                  {/* Social User ID if different */}
                  {link.socialUserId && link.socialUserId !== link.identity && (
                    <p className="text-xs text-gray-500 mt-1">ID: {link.socialUserId}</p>
                  )}
                  
                  {/* Details or Link prompt */}
                  <p className={`text-xs mt-1 ${link.linkUrl ? 'text-indigo-400' : 'text-gray-500'}`}>
                    {link.details}
                    {link.linkUrl && (
                      <span className="ml-1 underline">→ Link in Account Console</span>
                    )}
                  </p>
                </div>
                
                {/* Check mark or Link icon */}
                {(link.isActive || link.isLinked) ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    link.isActive ? colors.bg : 'bg-white/10'
                  }`}>
                    <Check className={`w-5 h-5 ${link.isActive ? colors.icon : 'text-gray-400'}`} />
                  </div>
                ) : link.linkUrl && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/20">
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
              </div>
            )
            
            // Wrap in link if linkUrl exists
            if (link.linkUrl) {
              return (
                <a
                  key={link.id}
                  href={link.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative block p-4 rounded-xl border-2 transition-all cursor-pointer
                    bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:border-indigo-500/50 hover:bg-indigo-500/10`}
                >
                  {cardContent}
                </a>
              )
            }
            
            return (
              <div 
                key={link.id}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  link.isActive 
                    ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} ring-offset-2 ring-offset-slate-900` 
                    : link.isLinked
                      ? `${colors.bg} border-white/20 opacity-80`
                      : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                {/* Active Badge */}
                {link.isActive && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-900 border-2 border-gray-900 shadow-lg shadow-black/50 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                  </div>
                )}
                
                {/* Linked Badge (not active but linked) */}
                {!link.isActive && link.isLinked && link.id !== 'keycloak' && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/20">
                    Linked
                  </div>
                )}
                
                {cardContent}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {!loading && (
        <div className="mt-6 p-4 bg-slate-800/50 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${colorClasses[activeSource?.color]?.bg || 'bg-green-500'} animate-pulse`}></div>
            <p className="text-sm font-medium">
              Authenticated via <span className={colorClasses[activeSource?.color]?.text || 'text-green-400'}>{activeSource?.name}</span>
            </p>
          </div>
          <p className="text-xs text-gray-500">
            {linkedCount === 1 
              ? 'You have 1 identity source. Link additional accounts above or in the Account Console.'
              : `You have ${linkedCount} linked identity sources. The highlighted one was used for this session.`
            }
          </p>
        </div>
      )}

      {/* Tip */}
      {!loading && linkedCount === 1 && linkedAccounts.length === 0 && (
        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <p className="text-xs text-indigo-300">
            <strong>💡 Tip:</strong> Configure IdP federation in RHBK (GitHub, Google, Okta) to see linkable accounts here!
          </p>
        </div>
      )}
    </div>
  )
}
