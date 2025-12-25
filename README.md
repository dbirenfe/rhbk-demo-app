# RHBK Demo Application

A beautiful demo application showcasing Red Hat Build of Keycloak (RHBK) capabilities including:

- 🔐 **OpenID Connect Authentication** - Login with RHBK using OAuth 2.0/OIDC
- 👥 **Group-based Access Control** - Sections that show/hide based on group membership
- 🎫 **JWT Token Inspector** - View and decode access/ID tokens in real-time
- 👤 **User Profile Display** - Show authenticated user information
- 📊 **OIDC Flow Visualization** - Educational diagram of the authentication flow

## Screenshots

The app features:
- Modern dark theme with Red Hat branding
- Animated transitions and micro-interactions
- Responsive design for all screen sizes
- Syntax-highlighted JWT token viewer

## Prerequisites

- Node.js 18+ (for local development)
- OpenShift cluster with RHBK deployed
- `rhbk-demo` client configured in RHBK

## Quick Start (Local Development)

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

## Deploy to OpenShift

### Option 1: Using oc new-app (Recommended)

```bash
# Create namespace
oc new-project rhbk-demo

# Create the app from source
oc new-app --name=rhbk-demo \
  --strategy=docker \
  --context-dir=rhbk-demo-app \
  https://github.com/YOUR-REPO/YOUR-PROJECT.git

# Or from local source
oc new-build --name=rhbk-demo --binary --strategy=docker
oc start-build rhbk-demo --from-dir=. --follow

# Create route
oc create route edge rhbk-demo --service=rhbk-demo --port=8080

# Set environment variables
oc set env deployment/rhbk-demo \
  RHBK_AUTHORITY=https://keycloak.apps.cluster-4mbjq.dynamic.redhatworkshops.io/realms/ocp \
  RHBK_CLIENT_ID=rhbk-demo \
  RHBK_CLIENT_SECRET=rhbk-demo-secret-change-me
```

### Option 2: Using provided manifests

```bash
# Apply all manifests
oc apply -f k8s/

# Build the image
oc start-build rhbk-demo --from-dir=. --follow

# Update the deployment to use the new image
oc set image deployment/rhbk-demo rhbk-demo=image-registry.openshift-image-registry.svc:5000/rhbk-demo/rhbk-demo:latest
```

## Configure RHBK Client

Make sure the `rhbk-demo` client is configured in your RHBK realm:

1. **Client ID:** `rhbk-demo`
2. **Client Protocol:** `openid-connect`
3. **Access Type:** `confidential`
4. **Valid Redirect URIs:**
   - `https://rhbk-demo.apps.YOUR-CLUSTER/*`
   - `http://localhost:3000/*` (for development)
5. **Web Origins:**
   - `https://rhbk-demo.apps.YOUR-CLUSTER`
   - `http://localhost:3000`
6. **Client Scopes:** `openid`, `profile`, `email`, `groups`

Or apply the updated `rhbk-realm-import.yaml` which includes the client configuration.

## Role-Based Access Demo

The app demonstrates role-based sections:

| Section | Required Group/Role |
|---------|-------------------|
| Admin Panel | `ocp-admins` or `admin` role |
| Developer Tools | `ocp-developers` or `developer` role |
| Resource Viewer | `ocp-viewers` or `viewer` role |

To test, add users to these groups in RHBK.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RHBK_AUTHORITY` | OIDC issuer URL | (required) |
| `RHBK_CLIENT_ID` | OIDC client ID | `rhbk-demo` |
| `RHBK_CLIENT_SECRET` | OIDC client secret | (required) |

## Build with Podman

```bash
# Build the image
podman build -t quay.io/dbirenfe/rhbk-demo-app:latest .

# Push to Quay.io
podman login quay.io
podman push quay.io/dbirenfe/rhbk-demo-app:latest
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **react-oidc-context** - OIDC authentication
- **lucide-react** - Icons
- **jwt-decode** - JWT parsing
- **Red Hat UBI 9** - Base image for Node.js build
- **nginx-unprivileged** - Production runtime from Quay.io

## License

MIT

