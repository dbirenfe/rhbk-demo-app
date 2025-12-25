# RHBK Demo Application

A beautiful demo application showcasing Red Hat Build of Keycloak (RHBK) capabilities including:

- 🔐 **OpenID Connect Authentication** - Login with RHBK using OAuth 2.0/OIDC
- 👥 **Group-based Access Control** - Sections that show/hide based on group membership
- 🎫 **JWT Token Inspector** - View and decode access/ID tokens in real-time
- 👤 **User Profile Display** - Show authenticated user information with auth time and token expiry
- 📊 **OIDC Flow Visualization** - Educational diagram of the authentication flow
- 🔄 **Live Permission Refresh** - Update permissions without page reload, with visual change detection

## Features

- **Modern dark theme** with Red Hat branding
- **Animated transitions** and micro-interactions
- **Responsive design** for all screen sizes
- **Syntax-highlighted JWT token viewer** with decoded/raw toggle
- **Smart refresh** - Only highlights cards that actually changed
- **Green glow effect** on updated sections after permission refresh

## Prerequisites

- OpenShift cluster with RHBK deployed
- `rhbk-demo` client configured in RHBK
- Podman (for building images)

## Quick Start - Deploy to OpenShift

### 1. Create the Namespace and Secret

```bash
# Create namespace
oc new-project rhbk-demo

# Create the OIDC secret with your RHBK configuration
oc create secret generic rhbk-demo-oidc \
  --from-literal=RHBK_AUTHORITY=https://keycloak.apps.YOUR-CLUSTER/realms/ocp \
  --from-literal=RHBK_CLIENT_ID=rhbk-demo \
  --from-literal=RHBK_CLIENT_SECRET=your-client-secret-here \
  -n rhbk-demo
```

### 2. Deploy from Quay.io Image

```bash
# Deploy the app using the pre-built image
oc new-app --name=rhbk-demo \
  --image=quay.io/dbirenfe/rhbk-demo-app:latest \
  -n rhbk-demo

# Link the secret to the deployment
oc set env deployment/rhbk-demo --from=secret/rhbk-demo-oidc -n rhbk-demo

# Create HTTPS route
oc create route edge rhbk-demo --service=rhbk-demo --port=8080 -n rhbk-demo

# Get the route URL
oc get route rhbk-demo -n rhbk-demo -o jsonpath='{.spec.host}'
```

### 3. Or Deploy Using Provided Manifests

```bash
# Apply all manifests (includes namespace, secret, deployment, service, route)
oc apply -f k8s/deployment.yaml

# Note: Update the secret values in k8s/deployment.yaml before applying!
```

## Build Your Own Image

```bash
# Build with Podman
podman build -t quay.io/YOUR-USERNAME/rhbk-demo-app:latest .

# Push to Quay.io
podman login quay.io
podman push quay.io/YOUR-USERNAME/rhbk-demo-app:latest
```

## Configure RHBK Client

Create the `rhbk-demo` client in your RHBK realm:

1. Go to **RHBK Admin Console** → **Clients** → **Create client**
2. Configure:
   - **Client ID:** `rhbk-demo`
   - **Client Protocol:** `openid-connect`
   - **Client authentication:** `ON` (confidential)
3. Under **Settings**:
   - **Valid Redirect URIs:**
     - `https://rhbk-demo.apps.YOUR-CLUSTER/*`
     - `http://localhost:3000/*` (for development)
   - **Web Origins:**
     - `https://rhbk-demo.apps.YOUR-CLUSTER`
     - `http://localhost:3000`
4. Under **Client scopes** → **Add client scope**:
   - Add `groups` as a **Default** scope (not optional!)
5. Copy the **Client Secret** from the **Credentials** tab

Or apply the `rhbk-realm-import.yaml` which includes the client configuration.

## Environment Variables / Secret

The app requires these environment variables (provided via Kubernetes Secret):

| Variable | Description | Example |
|----------|-------------|---------|
| `RHBK_AUTHORITY` | OIDC issuer URL (realm endpoint) | `https://keycloak.apps.cluster.example.com/realms/ocp` |
| `RHBK_CLIENT_ID` | OIDC client ID | `rhbk-demo` |
| `RHBK_CLIENT_SECRET` | OIDC client secret | `your-secret-from-rhbk` |

### Creating/Updating the Secret

```bash
# Create new secret
oc create secret generic rhbk-demo-oidc \
  --from-literal=RHBK_AUTHORITY=https://keycloak.apps.YOUR-CLUSTER/realms/ocp \
  --from-literal=RHBK_CLIENT_ID=rhbk-demo \
  --from-literal=RHBK_CLIENT_SECRET=your-client-secret \
  -n rhbk-demo

# Or update existing secret
oc create secret generic rhbk-demo-oidc \
  --from-literal=RHBK_AUTHORITY=https://keycloak.apps.YOUR-CLUSTER/realms/ocp \
  --from-literal=RHBK_CLIENT_ID=rhbk-demo \
  --from-literal=RHBK_CLIENT_SECRET=your-client-secret \
  -n rhbk-demo \
  --dry-run=client -o yaml | oc apply -f -

# Restart deployment to pick up changes
oc rollout restart deployment/rhbk-demo -n rhbk-demo
```

## Role-Based Access Demo

The app demonstrates role-based sections with visual feedback:

| Section | Required Group/Role | Color |
|---------|-------------------|-------|
| Admin Panel | `ocp-admins` or `Whitelist` | 🔴 Red |
| Developer Tools | `ocp-developers` | 🔵 Blue |
| Resource Viewer | `ocp-viewers` | 🟢 Green |

**Demo flow:**
1. Login as a user with no groups → all sections show "Restricted"
2. In RHBK Admin, add user to `ocp-viewers` group
3. Click the **Refresh button (🔄)** in the app header
4. Watch the "Groups & Roles" card and "Resource Viewer" section glow green!
5. Sections that didn't change remain unchanged (no glow)

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update OIDC configuration in `src/main.jsx`:**
   ```javascript
   const oidcConfig = {
     authority: "https://keycloak.apps.YOUR-CLUSTER/realms/ocp",
     client_id: "rhbk-demo",
     client_secret: "your-client-secret",
     // ...
   }
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:3000

## User Profile Fields

The User Profile card displays:

| Field | Description |
|-------|-------------|
| Username | The `preferred_username` claim |
| Full Name | Combined first/last name |
| Email | User's email address |
| Subject ID | Unique user identifier (truncated) |
| Realm | The RHBK realm name |
| Auth Time | When the user actually logged in (doesn't change on token refresh) |
| Token Expires | When the current access token expires (changes on each refresh) |

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **react-oidc-context** - OIDC authentication
- **oidc-client-ts** - OIDC client library
- **jwt-decode** - JWT parsing
- **lucide-react** - Icons
- **Red Hat UBI 9** - Base image for Node.js build
- **nginx-unprivileged** - Production runtime from Quay.io

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Infinite loading | Clear browser storage: DevTools → Application → Clear site data |
| Groups not showing | Ensure `groups` scope is in **Default** client scopes (not Optional) |
| Token refresh fails | Check client secret matches between app and RHBK |
| "No matching state" error | Refresh the page or clear browser cache |

## Source Code

- **GitHub:** https://github.com/dbirenfe/rhbk-demo-app
- **Container Image:** quay.io/dbirenfe/rhbk-demo-app:latest

## License

MIT
