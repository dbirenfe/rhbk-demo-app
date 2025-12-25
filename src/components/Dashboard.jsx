import { useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { jwtDecode } from 'jwt-decode'
import { 
  User, LogOut, Shield, Users, Key, Lock, 
  FileJson, Eye, Settings, Code, Terminal,
  Crown, Wrench, BookOpen, RefreshCw, Check
} from 'lucide-react'
import UserInfoCard from './UserInfoCard'
import TokenViewer from './TokenViewer'
import GroupsRolesCard from './GroupsRolesCard'
import RoleBasedSection from './RoleBasedSection'
import OIDCFlowCard from './OIDCFlowCard'
import IdentitySourceCard from './IdentitySourceCard'

export default function Dashboard() {
  const auth = useAuth()
  const user = auth.user
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [changedSections, setChangedSections] = useState({
    groups: false,
    admin: false,
    developer: false,
    viewer: false
  })
  
  // Decode tokens
  let accessTokenDecoded = null
  let idTokenDecoded = null
  
  try {
    if (user?.access_token) {
      accessTokenDecoded = jwtDecode(user.access_token)
    }
    if (user?.id_token) {
      idTokenDecoded = jwtDecode(user.id_token)
    }
  } catch (e) {
    console.error("Error decoding tokens:", e)
  }

  // Extract groups and roles
  const groups = accessTokenDecoded?.groups || idTokenDecoded?.groups || []
  const realmRoles = accessTokenDecoded?.realm_access?.roles || []
  const clientRoles = accessTokenDecoded?.resource_access || {}

  // Check for specific roles/groups
  const isAdmin = groups.includes('ocp-admins') || groups.includes('Whitelist') || realmRoles.includes('admin')
  const isDeveloper = groups.includes('ocp-developers') || realmRoles.includes('developer')
  const isViewer = groups.includes('ocp-viewers') || realmRoles.includes('viewer')

  // Refresh token to get updated groups/roles
  const handleRefreshPermissions = async () => {
    if (isRefreshing) return
    
    // Store current state BEFORE refresh
    const prevGroups = [...groups]
    const prevIsAdmin = isAdmin
    const prevIsDeveloper = isDeveloper
    const prevIsViewer = isViewer
    
    console.log('=== REFRESH START ===')
    console.log('Previous state:', { prevGroups, prevIsAdmin, prevIsDeveloper, prevIsViewer })
    
    setIsRefreshing(true)
    setChangedSections({ groups: false, admin: false, developer: false, viewer: false })
    
    try {
      await auth.signinSilent()
      
      // Wait a bit for auth state to update, then check new token
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get new token from auth
      const newToken = auth.user?.access_token
      if (newToken) {
        const decoded = jwtDecode(newToken)
        const newGroups = decoded?.groups || []
        const newIsAdmin = newGroups.includes('ocp-admins') || newGroups.includes('Whitelist')
        const newIsDeveloper = newGroups.includes('ocp-developers')
        const newIsViewer = newGroups.includes('ocp-viewers')
        
        console.log('New state:', { newGroups, newIsAdmin, newIsDeveloper, newIsViewer })
        
        // Compare
        const groupsChanged = JSON.stringify(prevGroups.sort()) !== JSON.stringify(newGroups.sort())
        const adminChanged = prevIsAdmin !== newIsAdmin
        const developerChanged = prevIsDeveloper !== newIsDeveloper
        const viewerChanged = prevIsViewer !== newIsViewer
        
        console.log('Changes:', { groupsChanged, adminChanged, developerChanged, viewerChanged })
        
        // Set highlights for changed sections
        setChangedSections({
          groups: groupsChanged,
          admin: adminChanged,
          developer: developerChanged,
          viewer: viewerChanged
        })
        
        // Clear highlights after 3 seconds
        setTimeout(() => {
          setChangedSections({ groups: false, admin: false, developer: false, viewer: false })
        }, 3000)
      }
      
      console.log('=== REFRESH COMPLETE ===')
    } catch (error) {
      console.error('Refresh failed:', error.message)
    }
    
    setIsRefreshing(false)
  }
  
  // Check if any section changed (for button icon)
  const hasChanges = changedSections.groups || changedSections.admin || changedSections.developer || changedSections.viewer

  return (
    <div className="min-h-screen animated-bg text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rhbk-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 100 100">
                <path d="M35 30 L50 50 L35 70 M50 50 L65 30 M50 50 L65 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold">RHBK Demo</h1>
              <p className="text-xs text-gray-400">Authenticated Session</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-400">Connected</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-rhbk-500 to-rhbk-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user?.profile?.given_name?.[0] || user?.profile?.preferred_username?.[0] || '?'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.profile?.name || user?.profile?.preferred_username}</p>
                <p className="text-xs text-gray-400">{user?.profile?.email}</p>
              </div>
            </div>
            
            <button 
              onClick={handleRefreshPermissions}
              disabled={isRefreshing}
              className={`p-2 rounded-lg transition-all duration-300 ${
                hasChanges 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'hover:bg-white/10 disabled:opacity-50'
              }`}
              title="Refresh Permissions (get updated groups)"
            >
              {hasChanges ? (
                <Check className="w-5 h-5" />
              ) : (
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              )}
            </button>
            
            <button 
              onClick={() => auth.signoutRedirect()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome, {user?.profile?.given_name || user?.profile?.preferred_username}! 👋
              </h2>
              <p className="text-gray-400">
                You have successfully authenticated using Red Hat Build of Keycloak.
                Explore the sections below to see RHBK capabilities.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <span className="px-3 py-1 bg-rhbk-500/20 text-rhbk-400 rounded-full text-sm font-medium flex items-center gap-1">
                  <Crown className="w-4 h-4" /> Admin
                </span>
              )}
              {isDeveloper && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium flex items-center gap-1">
                  <Wrench className="w-4 h-4" /> Developer
                </span>
              )}
              {isViewer && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                  <Eye className="w-4 h-4" /> Viewer
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* User Info */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <UserInfoCard user={user} idToken={idTokenDecoded} accessToken={accessTokenDecoded} />
          </div>
          
          {/* Groups & Roles */}
          <div 
            className={`lg:col-span-2 animate-slide-up transition-all duration-500 rounded-2xl ${
              changedSections.groups ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-transparent shadow-lg shadow-green-500/20' : ''
            }`} 
            style={{ animationDelay: '200ms' }}
          >
            <GroupsRolesCard 
              groups={groups} 
              realmRoles={realmRoles} 
              clientRoles={clientRoles} 
            />
          </div>
        </div>

        {/* Identity Source */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <IdentitySourceCard 
            idToken={idTokenDecoded}
            accessToken={accessTokenDecoded}
            accessTokenRaw={user?.access_token}
            profile={user?.profile}
          />
        </div>

        {/* Role-Based Sections */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-rhbk-500" />
            Role-Based Access Control Demo
          </h3>
          <p className="text-gray-400 mb-6">
            These sections demonstrate how different roles/groups control access to features.
            Your current permissions determine which sections you can access.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`transition-all duration-500 rounded-2xl ${
              changedSections.admin ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20' : ''
            }`}>
              <RoleBasedSection
                title="Admin Panel"
                description="System configuration, user management, and audit logs"
                icon={Crown}
                color="red"
                hasAccess={isAdmin}
                requiredRole="ocp-admins or admin role"
              />
            </div>
            <div className={`transition-all duration-500 rounded-2xl ${
              changedSections.developer ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20' : ''
            }`}>
              <RoleBasedSection
                title="Developer Tools"
                description="API documentation, debugging tools, and deployment configs"
                icon={Code}
                color="blue"
                hasAccess={isDeveloper || isAdmin}
                requiredRole="ocp-developers or developer role"
              />
            </div>
            <div className={`transition-all duration-500 rounded-2xl ${
              changedSections.viewer ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20' : ''
            }`}>
              <RoleBasedSection
                title="Resource Viewer"
                description="View dashboards, reports, and monitoring data"
                icon={Eye}
                color="green"
                hasAccess={isViewer || isDeveloper || isAdmin}
                requiredRole="ocp-viewers or viewer role"
              />
            </div>
          </div>
        </div>

        {/* Token Viewers */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-rhbk-500" />
            JWT Token Inspector
          </h3>
          <p className="text-gray-400 mb-6">
            Inspect the actual JWT tokens issued by RHBK. These tokens contain claims about your identity and permissions.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <TokenViewer
                title="Access Token"
                subtitle="Used to access protected resources"
                token={user?.access_token}
                decoded={accessTokenDecoded}
                color="purple"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <TokenViewer
                title="ID Token"
                subtitle="Contains user identity information"
                token={user?.id_token}
                decoded={idTokenDecoded}
                color="cyan"
              />
            </div>
          </div>
        </div>

        {/* OIDC Flow */}
        <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <OIDCFlowCard issuer={idTokenDecoded?.iss || accessTokenDecoded?.iss} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>RHBK Demo Application • Red Hat Build of Keycloak</p>
          <p className="mt-1">Session expires: {user?.expires_at ? new Date(user.expires_at * 1000).toLocaleString() : 'N/A'}</p>
        </div>
      </footer>
    </div>
  )
}

