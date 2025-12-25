# RHBK Demo Application

A beautiful demo application showcasing Red Hat Build of Keycloak (RHBK) capabilities including:

- 🔐 **OpenID Connect Authentication** - Login with RHBK using OAuth 2.0/OIDC
- 👥 **Group-based Access Control** - Sections that show/hide based on group membership
- 🎫 **JWT Token Inspector** - View and decode access/ID tokens in real-time
- 👤 **User Profile Display** - Show authenticated user information with auth time and token expiry
- 🔗 **Identity Sources** - Shows all linked IdPs (GitHub, Google, Okta, etc.) and highlights the one used for login
- 📊 **OIDC Flow Visualization** - Educational diagram of the authentication flow
- 🔄 **Live Permission Refresh** - Update permissions without page reload, with visual change detection

## What This Demo Shows

| RHBK Capability | How It's Demonstrated |
|-----------------|----------------------|
| **OIDC Authentication** | Login flow with Authorization Code + PKCE |
| **Identity Federation** | GitHub/Google/Okta login, shows which IdP was used |
| **Account Linking** | Multiple IdPs linked to one user, visible in Identity Sources |
| **Group-Based RBAC** | Sections unlock based on RHBK group membership |
| **JWT Tokens** | Inspect Access & ID tokens with all claims |
| **Token Lifecycle** | Auth Time vs Token Expiry, live token refresh |
| **Self-Service** | Links to Account Console for profile/password/linked accounts |
| **OIDC Discovery** | Links to `.well-known/openid-configuration` |

## Features

- **Modern dark theme** with Red Hat branding
- **Animated transitions** and micro-interactions
- **Responsive design** for all screen sizes
- **Syntax-highlighted JWT token viewer** with decoded/raw toggle
- **Smart refresh** - Only highlights cards that actually changed
- **Green glow effect** on updated sections after permission refresh
- **Real IdP icons** - GitHub, Google, Microsoft, GitLab, LinkedIn, Facebook, Okta
- **Account linking** - Connect unlinked IdPs via Keycloak Account Console
- **Quick access links** - Direct links to Account Console, Discovery Document, Admin Console

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

### Step 1: Create the Client

1. Go to **RHBK Admin Console** → Select your realm → **Clients** → **Create client**
2. **General Settings:**
   - **Client ID:** `rhbk-demo`
   - **Name:** `RHBK Demo Application` (optional)
   - Click **Next**

3. **Capability config:**
   - **Client authentication:** `ON` (confidential client)
   - **Authorization:** `OFF`
   - **Authentication flow:** ✅ Standard flow, ❌ Direct access grants
   - Click **Next**

4. **Login settings:**
   - **Root URL:** `https://rhbk-demo.apps.YOUR-CLUSTER`
   - **Valid redirect URIs:** `https://rhbk-demo.apps.YOUR-CLUSTER/*`
   - **Valid post logout redirect URIs:** `https://rhbk-demo.apps.YOUR-CLUSTER/*`
   - **Web origins:** `https://rhbk-demo.apps.YOUR-CLUSTER`
   - Click **Save**

5. **Get Client Secret:**
   - Go to **Credentials** tab
   - Copy the **Client secret** value

### Step 2: Configure Client Scopes

Go to **Client details** → **Client scopes** tab and ensure these are in **Default** (not Optional):

| Scope | Purpose |
|-------|---------|
| `profile` | User profile info (name, username) |
| `email` | User email address |
| `groups` | Group membership for RBAC |
| `roles` | Realm and client roles |

**To add a scope:** Click **Add client scope** → Select scope → **Add** → Choose **Default**

### Step 3: Configure Protocol Mappers for Identity Source Detection

To detect which Identity Provider (GitHub, Google, etc.) the user logged in with, add these mappers:

1. Go to **Client scopes** (left menu) → Click **profile**
2. Go to **Mappers** tab → **Add mapper** → **By configuration** → **User Session Note**

#### Mapper 1: `identity_provider`

| Field | Value |
|-------|-------|
| **Name** | `identity_provider` |
| **User Session Note** | `identity_provider` |
| **Token Claim Name** | `identity_provider` |
| **Claim JSON Type** | `String` |
| **Add to ID token** | ✅ ON |
| **Add to access token** | ✅ ON |
| **Add to userinfo** | ✅ ON |
| **Add to token introspection** | ✅ ON |

Click **Save**

#### Mapper 2: `identity_provider_identity`

| Field | Value |
|-------|-------|
| **Name** | `identity_provider_identity` |
| **User Session Note** | `identity_provider_identity` |
| **Token Claim Name** | `identity_provider_identity` |
| **Claim JSON Type** | `String` |
| **Add to ID token** | ✅ ON |
| **Add to access token** | ✅ ON |
| **Add to userinfo** | ✅ ON |
| **Add to token introspection** | ✅ ON |

Click **Save**

### Step 4: Configure Groups Mapper (if not already done)

1. Go to **Client scopes** → **groups** → **Mappers**
2. Click on **groups** mapper (or create one)
3. Ensure these settings:

| Field | Value |
|-------|-------|
| **Name** | `groups` |
| **Mapper Type** | `Group Membership` |
| **Token Claim Name** | `groups` |
| **Full group path** | ❌ OFF (important!) |
| **Add to ID token** | ✅ ON |
| **Add to access token** | ✅ ON |
| **Add to userinfo** | ✅ ON |

---

## Configure Identity Providers (Optional)

To demo the Identity Source feature, configure an external IdP like GitHub:

### GitHub Identity Provider

#### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name:** `RHBK Demo`
   - **Homepage URL:** `https://keycloak.apps.YOUR-CLUSTER`
   - **Authorization callback URL:** `https://keycloak.apps.YOUR-CLUSTER/realms/YOUR-REALM/broker/github/endpoint`
4. Click **Register application**
5. Copy **Client ID** and generate **Client Secret**

#### 2. Configure in RHBK

1. Go to **Identity providers** → **Add provider** → **GitHub**
2. Configure:

| Field | Value |
|-------|-------|
| **Alias** | `github` |
| **Display name** | `GitHub` |
| **Client ID** | (from GitHub) |
| **Client Secret** | (from GitHub) |
| **Default Scopes** | `user:email read:user` |

3. Under **Advanced settings:**
   - **Sync mode:** `import`
   - **Trust Email:** ✅ ON

4. Click **Save**

### Other Supported IdPs

The demo app has icons for these IdPs:
- **GitHub** - Social login
- **Google** - Social login  
- **Microsoft/Entra ID** - Enterprise OIDC
- **GitLab** - Social login
- **LinkedIn** - Social login
- **Facebook** - Social login
- **Okta** - Enterprise OIDC/SAML
- **LDAP/Active Directory** - Directory federation

---

## Complete Client Configuration Reference

Here's the complete JSON export of a properly configured client:

```json
{
  "clientId": "rhbk-demo",
  "name": "RHBK Demo Application",
  "rootUrl": "https://rhbk-demo.apps.YOUR-CLUSTER",
  "adminUrl": "https://rhbk-demo.apps.YOUR-CLUSTER",
  "baseUrl": "/",
  "enabled": true,
  "clientAuthenticatorType": "client-secret",
  "redirectUris": ["https://rhbk-demo.apps.YOUR-CLUSTER/*"],
  "webOrigins": ["https://rhbk-demo.apps.YOUR-CLUSTER"],
  "standardFlowEnabled": true,
  "directAccessGrantsEnabled": false,
  "publicClient": false,
  "protocol": "openid-connect",
  "fullScopeAllowed": true,
  "defaultClientScopes": [
    "web-origins",
    "acr",
    "profile",
    "roles",
    "groups",
    "basic",
    "email"
  ],
  "optionalClientScopes": [
    "address",
    "phone",
    "offline_access"
  ]
}
```

Or apply the `rhbk-realm-import.yaml` which includes the client and all mapper configurations.

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

---

## 🎯 Demo Walkthrough

Use this script when presenting the RHBK Demo to your team:

### Opening (Landing Page)
> "This is a demo application that showcases Red Hat Build of Keycloak's core capabilities. Let's start by logging in."

1. Click **Login with Keycloak**
2. Point out the Keycloak login page branding

### Authentication Options
> "Notice we have multiple ways to authenticate - local credentials or external Identity Providers like GitHub."

- **Show local login**: Enter username/password
- **Show IdP login**: Click GitHub button (if configured)

### User Profile Card
> "After login, we can see the user's profile information pulled from RHBK tokens."

Point out:
- Username, email, full name from OIDC claims
- **Auth Time** - when the user actually authenticated
- **Token Expires** - when the access token expires (changes on refresh)
- Subject ID - unique identifier

### Identity Sources Card
> "This shows where the user authenticated from and any linked identity providers."

Point out:
- **Active badge** shows which IdP was used for THIS login
- **Linked badge** shows other connected accounts
- Click **Manage** to open Account Console
- Unlinked IdPs can be connected via Account Console

### Groups & Roles Card
> "RHBK sends group membership and roles in the JWT token, enabling fine-grained access control."

Point out:
- Groups from the `groups` claim
- Realm roles from `realm_access`
- Client roles from `resource_access`

### Role-Based Access Control Demo
> "Let's see how groups control access to application features."

**Live Demo:**
1. Note which sections show "Restricted" vs "Accessible"
2. Open RHBK Admin Console in another tab
3. Add user to `ocp-viewers` group
4. Click the **Refresh (🔄)** button in the app
5. Watch the sections update with **green glow effect**!

### JWT Token Viewer
> "We can inspect the actual JWT tokens to see exactly what claims RHBK sends."

Point out:
- Toggle between **Decoded** and **Raw** views
- Show both **Access Token** and **ID Token** tabs
- Highlight key claims: `groups`, `realm_access`, `identity_provider`

### OIDC Flow Diagram
> "This shows the Authorization Code flow that just happened behind the scenes."

Walk through the 5 steps of the OIDC flow.

### Quick Access Links
> "The app provides direct links to RHBK resources."

- **Account Console** - User self-service
- **Discovery Document** - OIDC configuration endpoint
- **Admin Console** - For administrators

### Closing
> "This demo shows how RHBK provides enterprise-grade identity management with support for multiple identity sources, fine-grained RBAC, and standard OIDC protocols."

---

## ✅ Quick Setup Checklist

Before the demo, verify:

- [ ] RHBK is running and accessible
- [ ] `rhbk-demo` client is created with correct redirect URIs
- [ ] Client scopes configured: `profile`, `email`, `groups`, `roles`
- [ ] `identity_provider` mapper added to `profile` scope
- [ ] `groups` mapper has "Full group path" OFF
- [ ] Demo groups created: `ocp-admins`, `ocp-developers`, `ocp-viewers`
- [ ] Test user created (not in any groups initially)
- [ ] (Optional) GitHub IdP configured for social login demo
- [ ] Demo app deployed and accessible
- [ ] Secret configured with correct RHBK URL and credentials

---

## Role-Based Access Demo

The app demonstrates role-based sections with visual feedback:

| Section | Required Group/Role | Color |
|---------|-------------------|-------|
| Admin Panel | `ocp-admins` or `Whitelist` | 🔴 Red |
| Developer Tools | `ocp-developers` | 🔵 Blue |
| Resource Viewer | `ocp-viewers` | 🟢 Green |

### Create Demo Groups in RHBK

1. Go to **RHBK Admin Console** → **Groups** → **Create group**
2. Create these groups:
   - `ocp-admins` - For admin access
   - `ocp-developers` - For developer access  
   - `ocp-viewers` - For read-only access
   - `Whitelist` - Alternative admin group

### Demo Flow

1. Login as a user with no groups → all sections show "Restricted"
2. In RHBK Admin Console:
   - Go to **Users** → Select user → **Groups** tab
   - Click **Join Group** → Select `ocp-viewers` → **Join**
3. Back in the demo app, click the **Refresh button (🔄)** in the header
4. Watch the "Groups & Roles" card and "Resource Viewer" section glow green!
5. Sections that didn't change remain unchanged (no glow)

### Pro Tip for Live Demos
Keep RHBK Admin Console open in a second browser/tab so you can quickly add/remove groups and show the immediate effect in the app.

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
| Identity Source shows wrong IdP | Add `identity_provider` mapper to `profile` scope (see Step 3 above) |
| GitHub/IdP not showing as "Active" | Ensure you logged in via the IdP button, not username/password |
| Linked accounts not loading | Ensure client has `account` scope or user has `manage-account` role |
| "Link in Account Console" opens | This is expected - linking is done via Keycloak Account Console |
| Group names have "/" prefix | Turn OFF "Full group path" in the groups mapper |

## Source Code

- **GitHub:** https://github.com/dbirenfe/rhbk-demo-app
- **Container Image:** quay.io/dbirenfe/rhbk-demo-app:latest

## License

MIT
