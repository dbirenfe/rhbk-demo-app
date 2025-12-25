import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import App from './App'
import './index.css'

// Callback to clean up URL after successful authentication
// This prevents the "No matching state found" error on page refresh
const onSigninCallback = () => {
  // Remove the OAuth callback parameters from the URL
  window.history.replaceState({}, document.title, window.location.pathname)
}

// OIDC Configuration - Update these values for your environment
const oidcConfig = {
  authority: window.RHBK_AUTHORITY || "https://keycloak.apps.cluster-4mbjq.dynamic.redhatworkshops.io/realms/ocp",
  client_id: window.RHBK_CLIENT_ID || "rhbk-demo",
  client_secret: window.RHBK_CLIENT_SECRET || "rhbk-demo-secret-change-me",
  redirect_uri: window.location.origin + "/",
  post_logout_redirect_uri: window.location.origin + "/",
  scope: "openid profile email groups",
  response_type: "code",
  automaticSilentRenew: true,
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
