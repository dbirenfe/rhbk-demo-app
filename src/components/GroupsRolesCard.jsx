import { Users, Shield, Key } from 'lucide-react'

export default function GroupsRolesCard({ groups, realmRoles, clientRoles }) {
  return (
    <div className="glass rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold">Groups & Roles</h3>
          <p className="text-xs text-gray-400">Your authorization attributes from RHBK</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Groups */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-400" />
            <h4 className="font-medium text-sm">Groups</h4>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {groups.length}
            </span>
          </div>
          
          {groups.length > 0 ? (
            <div className="space-y-2">
              {groups.map((group, index) => (
                <div 
                  key={group}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 animate-slide-in-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-mono">{group}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white/5 rounded-lg">
              <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No groups assigned</p>
            </div>
          )}
        </div>

        {/* Realm Roles */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-green-400" />
            <h4 className="font-medium text-sm">Realm Roles</h4>
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
              {realmRoles.length}
            </span>
          </div>
          
          {realmRoles.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {realmRoles.map((role, index) => (
                <div 
                  key={role}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20 animate-slide-in-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-mono">{role}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white/5 rounded-lg">
              <Key className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No realm roles assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* Client Roles */}
      {Object.keys(clientRoles).length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-amber-400" />
            <h4 className="font-medium text-sm">Client Roles</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(clientRoles).map(([client, data]) => (
              <div key={client} className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2 font-mono">{client}</p>
                <div className="flex flex-wrap gap-1">
                  {data.roles?.map(role => (
                    <span 
                      key={role}
                      className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-md"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-rhbk-500/10 border border-rhbk-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-rhbk-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-rhbk-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              Groups and roles are sent by RHBK in the JWT token's <code className="px-1 py-0.5 bg-white/10 rounded text-rhbk-400">groups</code> and <code className="px-1 py-0.5 bg-white/10 rounded text-rhbk-400">realm_access</code> claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

