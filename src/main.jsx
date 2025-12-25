import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import { Log } from 'oidc-client-ts'
import App from './App'
import './index.css'

// Enable OIDC debugging in console
Log.setLogger(console)
Log.setLevel(Log.DEBUG)

// Callback to clean up URL after successful authentication
const onSigninCallback = (user) => {
  console.log('✅ Sign-in successful!', user)
  // Mark that we just logged in (prevents auto-refresh loop)
  sessionStorage.setItem('rhbk_just_logged_in', 'true')
  // Remove the OAuth callback parameters from the URL
  window.history.replaceState({}, document.title, window.location.pathname)
}

// Log the config for debugging
console.log('RHBK Config:', {
  authority: window.RHBK_AUTHORITY || "(default)",
  client_id: window.RHBK_CLIENT_ID || "(default)",
  has_secret: !!(window.RHBK_CLIENT_SECRET),
})

// OIDC Configuration
const oidcConfig = {
  authority: window.RHBK_AUTHORITY || "https://keycloak.apps.cluster-4mbjq.dynamic.redhatworkshops.io/realms/ocp",
  client_id: window.RHBK_CLIENT_ID || "rhbk-demo",
  client_secret: window.RHBK_CLIENT_SECRET || "rhbk-demo-secret-change-me",
  redirect_uri: window.location.origin + "/",
  post_logout_redirect_uri: window.location.origin + "/",
  scope: "openid profile email groups",
  response_type: "code",
  // Disable automatic silent renew to prevent loops
  automaticSilentRenew: false,
  loadUserInfo: true,
  onSigninCallback: onSigninCallback,
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
