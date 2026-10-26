# Estate 360 - Frontend Guide for Agents & Developers

Welcome to the **Estate 360** frontend application. This document outlines the architecture, design system, component hierarchy, backend integrations, and coding standards for AI agents and human developers extending this codebase.

---

## 1. Tech Stack Overview

- **Framework**: React 19 (JavaScript / JSX)
- **Bundler & Dev Server**: Vite 8 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 using `@tailwindcss/vite`
- **Icons**: `lucide-react`
- **Utilities**: `clsx`, `tailwind-merge` (`cn` helper in `src/lib/utils.js`)
- **Linting**: ESLint 10 with `react-hooks` and `react-refresh` plugins

---

## 2. Design System & Strict UI Constraints

Follow these strict visual guidelines for any new components or UI modifications:

### 2.1 Color Palette
Use only the approved enterprise agricultural color palette:

| Name | Hex Code | Purpose in UI |
|---|---|---|
| **Dark Green** | `#1F3D2C` | Brand Primary, top navbar, primary buttons, major headings, footer |
| **Light Green** | `#D7E6DD` | Card borders, background accents, subtle badges, secondary buttons |
| **Brown** | `#8C6239` | Earthy accent tones, workflow step indicators (`01`, `02`, `03`), sub-labels |
| **Yellow** | `#F1C40F` | Status badges, highlights, and operational indicators |
| **Off-White / Cream** | `#F8F9FA` | Main application background, modal/card canvas |

### 2.2 Typography
- **Headings** (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `.font-heading`): **PT Sans** (`'PT Sans', sans-serif`)
- **Body & Controls** (`body`, `input`, `button`, `select`, `textarea`, `label`): **Ubuntu** (`'Ubuntu', sans-serif`)
- Both fonts are imported via Google Fonts at the top of `src/index.css` and linked in `index.html`.

### 2.3 Visual Rules
1. **No Rounded Buttons / Cards**: Always use square edges (`rounded-none`). Do NOT use `rounded-md`, `rounded-lg`, or `rounded-full` unless specifically asked.
2. **No Glowing Effects**: Do NOT apply neon glow drop shadows, intense box-shadow spreads, or multi-color ambient radial gradients. Maintain clean, crisp, flat borders (`border border-[#D7E6DD]`).
3. **Brand Naming**: The application is **Estate 360** (with a space). Do NOT add "AI" to the brand name or logos.

---

## 3. Directory Structure

```text
frontend/
├── index.html                   # HTML entry point with Google Fonts prefetching
├── vite.config.js               # Vite config with Tailwind plugin & dev proxy
├── package.json                 # Dependencies & scripts
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Root URL router (delegates /admin/* vs public/owner routes)
│   ├── index.css                # Tailwind CSS v4 + theme variables + font imports
│   ├── router/                  # Lightweight URL router (History API & hash support)
│   │   ├── hooks.js             # RouterContext, useLocation, useNavigate, matchPath
│   │   ├── Router.jsx           # RouterProvider, Routes, Route, Link, NavLink, Navigate
│   │   └── index.js             # Router barrel exports
│   ├── context/                 # Separated application state contexts
│   │   ├── ownerContextState.js # OwnerContext & useOwner hook
│   │   ├── OwnerProvider.jsx    # Owner session, estates, and crops state provider
│   │   ├── OwnerContext.js      # Owner context barrel exports
│   │   ├── adminContextState.js # AdminContext & useAdmin hook
│   │   ├── AdminProvider.jsx    # Admin session, crops, owners, estates, IoT state provider
│   │   └── AdminContext.js      # Admin context barrel exports
│   ├── layouts/                 # Route layout wrappers
│   │   ├── PublicLayout.jsx     # Global Navbar wrapper for public & owner pages
│   │   ├── OwnerDashboardLayout.jsx # Protected owner layout with session header & alerts
│   │   └── AdminLayout.jsx      # Protected admin layout with header, stats bar & nav tabs
│   ├── pages/                   # Dedicated page components per URL route
│   │   ├── public/
│   │   │   ├── LandingPage.jsx          # /
│   │   │   ├── OwnerLoginPage.jsx       # /login
│   │   │   └── OwnerRegisterPage.jsx    # /register
│   │   ├── owner/
│   │   │   ├── OwnerHomePage.jsx           # /dashboard (3 card-like menus)
│   │   │   ├── OwnerEstatesPage.jsx        # /dashboard/estates (list & map overview)
│   │   │   ├── OwnerRegisterEstatePage.jsx # /dashboard/estates/new (estate registration)
│   │   │   ├── OwnerWorkforcePage.jsx      # /dashboard/workforce (workforce directory & stats)
│   │   │   ├── OwnerRegisterEmployeePage.jsx # /dashboard/workforce/new (employee enrollment)
│   │   │   └── OwnerPayrollsPage.jsx       # /dashboard/payrolls
│   │   └── admin/
│   │       ├── AdminLoginPage.jsx       # /admin/login
│   │       ├── AdminCropsPage.jsx       # /admin/crops
│   │       ├── AdminOwnersPage.jsx      # /admin/owners
│   │       ├── AdminEstatesPage.jsx     # /admin/estates
│   │       ├── AdminEmployeesPage.jsx   # /admin/employees (platform workforce directory)
│   │       ├── AdminIotPage.jsx         # /admin/iot
│   │       └── AdminUsersPage.jsx       # /admin/admins
│   ├── api/
│   │   ├── auth.js              # Owner auth API calls & token storage
│   │   ├── owner.js             # Owner estates & available crops API calls
│   │   └── admin.js             # Admin auth & CRUD API calls
│   ├── lib/
│   │   ├── utils.js             # Tailwind class merging utility (cn)
│   │   └── geoUtils.js          # Geodesic area & polygon self-intersection untangling
│   └── components/
│       ├── Navbar.jsx           # Global sticky header with route links & auth actions
│       ├── ui/                  # Flat, sharp Shadcn-style primitive components
│       │   ├── button.jsx       # Flat buttons (default, outline, secondary, earth, ghost)
│       │   ├── card.jsx         # Card, CardHeader, CardTitle, CardContent, CardFooter
│       │   ├── input.jsx        # Flat border text/password/tel input
│       │   ├── label.jsx        # Accessible form label
│       │   ├── badge.jsx        # Flat status tag (yellow, light, primary, brown)
│       │   ├── alert.jsx        # Flat notification banner (info, success, error, warning)
│       │   └── confirm-dialog.jsx # Custom confirmation modal (replaces window.confirm/alert)
│       ├── landing/             # Public landing page sections
│       │   ├── Hero.jsx         # Value proposition & owner auth CTAs
│       │   ├── Features.jsx     # High-level highlights (Estates, Workforce, Payroll)
│       │   ├── HowItWorks.jsx   # 3-step workflow (Registration -> Setup -> Payouts)
│       │   └── Footer.jsx       # Minimal single-row brand footer
│       ├── auth/                # Authentication forms
│       │   ├── OwnerLogin.jsx   # Owner sign-in form with password toggle
│       │   └── OwnerRegister.jsx# Owner profile creation form (name, email, phone, etc.)
│       ├── forms/               # Estate & operational input forms
│       │   ├── RegisterEstateForm.jsx # Estate registration with Map and Manual options
│       │   ├── RegisterEmployeeForm.jsx # Worker & Supervisor employee registration form
│       │   ├── EditEmployeeModal.jsx    # Modal for editing worker/supervisor attributes
│       │   └── SriLankaPolygonMap.jsx # Interactive OpenStreetMap Sri Lanka polygon picker
│       ├── estates/             # Estate presentation components
│       │   ├── EstateListCard.jsx     # Individual estate card item (view/edit/delete)
│       │   ├── EditEstateModal.jsx    # Modal for editing estate name, code, crop & status
│       │   └── EstatesOverviewMap.jsx # Interactive overview map of registered estates
│       └── admin/               # Separated admin components
│           ├── AdminApp.jsx           # Lazy-loaded /admin route sub-tree
│           ├── AdminLogin.jsx         # Admin login & first-admin setup form
│           ├── AdminHeader.jsx        # Admin top navigation bar
│           ├── AdminStatsBar.jsx      # Summary KPI cards for admin
│           ├── AdminNavBar.jsx        # Admin route tab navigation
│           ├── CropFormCard.jsx       # Add/Edit crop & payment rate form card
│           └── AdminEstateModal.jsx   # Estate boundary & details inspection modal
```

---

## 4. Routing & Page Architecture

The application uses URL-based client-side routing (`src/router/`) with separated layouts and page components:

### 4.1 Public & Owner Routes
- `/`: Public landing page ([`LandingPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/public/LandingPage.jsx))
- `/login`: Owner sign-in page ([`OwnerLoginPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/public/OwnerLoginPage.jsx))
- `/register`: Owner account registration page ([`OwnerRegisterPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/public/OwnerRegisterPage.jsx))
- `/dashboard`: Authenticated Owner Hub with 3 card menus ([`OwnerHomePage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/owner/OwnerHomePage.jsx))
- `/dashboard/estates`: Registered Estates list & map overview ([`OwnerEstatesPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/owner/OwnerEstatesPage.jsx))
- `/dashboard/estates/new`: Dedicated Estate Registration page ([`OwnerRegisterEstatePage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/owner/OwnerRegisterEstatePage.jsx))
- `/dashboard/workforce`: Workforce Crew page ([`OwnerWorkforcePage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/owner/OwnerWorkforcePage.jsx))
- `/dashboard/workforce/new`: Register New Employee page ([`OwnerRegisterEmployeePage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/owner/OwnerRegisterEmployeePage.jsx))
- `/dashboard/payrolls`: Payrolls page ([`OwnerPayrollsPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/owner/OwnerPayrollsPage.jsx))

### 4.2 Isolated Admin Routes (Lazy-Loaded, Manual URL Only)
- `/admin/login`: Admin login & initial admin setup ([`AdminLoginPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminLoginPage.jsx))
- `/admin/crops`: Crops & Payment Factors management ([`AdminCropsPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminCropsPage.jsx))
- `/admin/owners`: Owners directory & status control ([`AdminOwnersPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminOwnersPage.jsx))
- `/admin/estates`: All Estates inspection, boundary viewer, edit & delete ([`AdminEstatesPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminEstatesPage.jsx))
- `/admin/employees`: Workforce directory across all plantations, edit & delete ([`AdminEmployeesPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminEmployeesPage.jsx))
- `/admin/iot`: IoT Edge Devices & Cloud Sync ([`AdminIotPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminIotPage.jsx))
- `/admin/admins`: Administrator accounts management ([`AdminUsersPage.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/pages/admin/AdminUsersPage.jsx))

### User Flow & Architectural Rule
- **No Estate Registration on the Landing Page**: Public visitors can only register as an **Owner** (`OwnerRegister`).
- **3 Card-Like Menus on Dashboard**:
  1. **Registered Estates**: Clicking this card opens the dedicated Estates view containing all estate operations:
     - Includes the single **"Register New Estate"** button.
     - Embeds [`RegisterEstateForm.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/forms/RegisterEstateForm.jsx) with Sri Lanka OpenStreetMap polygon pinpointing, automatic area calculation, and manual coordinates.
     - Features List View and Map Overview of all registered estates.
     - Top navigation bar provides a `← Back to Dashboard` button to return to the card menu hub.
  2. **Workforce Crew**: Clicking this card opens the dedicated Workforce overview.
  3. **Payrolls**: Clicking this card opens the dedicated Payrolls overview.
- **Clean UI Presentation**: Technical database metadata and arbitrary numbering ("Menu 1, Menu 2") are omitted.
- **Single Sign Out Control**: Sign out is handled exclusively from the global top [`Navbar.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/Navbar.jsx).
- **Two Polygon Boundary Input Modes**:
  1. **Option 1: Pinpoint on OpenStreetMap Sri Lanka** ([`SriLankaPolygonMap.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/forms/SriLankaPolygonMap.jsx)):
     - Interactive Leaflet map centered on Sri Lanka loaded with OpenStreetMap tiles.
     - **Pinpoint Location Marker**: An active yellow pinpoint marker with a sharp needle point at bottom center `(10, 28)` providing sub-pixel coordinate alignment directly at the needle tip.
     - **Automatic Viewport Tracking on Zoom**: Whenever zooming in or out on any area of the map, if the pinpoint marker falls outside the new visible viewport bounds, it automatically snaps to the center of the active viewing area. A manual `"🎯 Center Pin in View"` button is also provided.
     - **Controlled Point Addition**: Clicking or moving the map moves the pinpoint marker and **does NOT automatically add points**. The user explicitly clicks **"Add Pinpointed Location as Point #N"** to confirm each vertex.
     - **Automatic Overlapping Lines Adjustment**: Employs a 2-opt and radial untangling algorithm ([`geoUtils.js`](file:///c:/Users/thson/Desktop/estate360/frontend/src/lib/geoUtils.js)) that automatically detects crossing edges and reorders vertices to guarantee a valid, non-self-intersecting polygon shape.
     - Confirmed vertices appear as numbered tags (`1`, `2`, `3`...) with a live polygon border/fill connecting them.
     - Confirmed vertices can be dragged to fine-tune or deleted individually.
     - **Strict Validation**: At least **3 boundary points are required** before the estate can be registered. The save button remains disabled with a progress indicator (`0/3`, `1/3`, `2/3`, `Ready`) until at least 3 points are confirmed.
     - Automatically calculates the geodesic land area (in **Acres**, **Hectares**, and **Square Meters**) in real time.
  2. **Option 2: Enter Polygon Points Manually**:
     - Owners can enter each vertex's latitude and longitude into an editable table (`+ Add Point`, delete point).
     - Features a **Bulk Paste** utility to paste raw coordinate pairs (e.g. from GPS surveys).
     - Automatically updates the calculated land area in real time and synchronizes with the map view.
- **PostGIS GeoJSON Payload**:
  - Automatically constructs the closed linear ring for `boundary: { type: 'Polygon', coordinates: [ [ [lon, lat], ..., [lon, lat] ] ] }`.
  - Automatically computes the centroid for `location: { type: 'Point', coordinates: [centroidLon, centroidLat] }`.

---

## 5. Backend API Integration

The frontend communicates with the NestJS Core-API running on `http://localhost:3000`.

### 5.1 Dev Server Proxy
`vite.config.js` proxies the following paths directly to `http://localhost:3000`:
- `/auth`, `/estates`, `/crops`, `/owners`, `/iot`, `/employees`, `/assignments`, `/attendance`, `/payroll`

### 5.2 Storage & Authentication
- Session tokens are stored in `localStorage` under the key `'estate360_auth'`:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { "id": "uuid", "email": "owner@estate.com", "role": "owner" }
  }
  ```
- Authenticated requests must pass the HTTP header:
  ```http
  Authorization: Bearer <accessToken>
  ```
- Helper functions in [`src/api/auth.js`](file:///c:/Users/thson/Desktop/estate360/frontend/src/api/auth.js):
  - `getStoredAuth()`
  - `setStoredAuth(data)`
  - `clearStoredAuth()`
  - `registerOwner(payload)`
  - `loginOwner(credentials)`
  - `fetchProfile(token)`

---

## 6. Coding & Linting Conventions

Before committing changes, agents must ensure:

1. **ESLint Cleanliness**:
   - No unused variables or unused imports (`no-unused-vars`).
   - Re-thrown errors in `catch` blocks must include `{ cause: err }` to satisfy `preserve-caught-error`.
   - Never call `setState` synchronously within the top-level body of a `useEffect` without an active-mount or async guard to avoid cascading renders.
2. **Class Names**:
   - Always merge dynamic classes using `cn(...)` from `src/lib/utils.js`.
   - Explicitly keep `rounded-none` on UI elements.
3. **Execution Mode**:
   - Sandboxed commands are preferred for builds and linting:
     ```powershell
     cd frontend
     npm run lint
     npm run build
     ```
   - Only package install commands (`npm install`) that require remote fetching should bypass the sandbox if packages are not in cache.

---

## 7. Useful Scripts

```bash
# Start local development server on port 5173
npm run dev

# Run ESLint validation
npm run lint

# Compile production bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Admin Dashboard & Manual Route (`/admin`)

Estate 360 includes a separate admin dashboard for managing crops, owners, estates, and devices:

### 8.1 Manual Route Access
- **No Public Links**: The main navbar and owner dashboards have no links or buttons to the admin page.
- **Manual URL**: Accessed by typing `/admin` (or `#/admin`) in the browser URL bar:
  ```text
  http://localhost:5173/admin
  http://localhost:5173/#/admin
  ```
- **Code-Splitting**: [`src/components/admin/AdminApp.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/admin/AdminApp.jsx) is lazy-loaded so normal visitors do not load the admin code.
- **Session Separation**: Admin login tokens are stored in `estate360_admin_auth` so they do not conflict with owner logins (`estate360_auth`).

### 8.2 Admin Features
1. **Crops & Payment Rates**:
   - Add new crops (`POST /crops`) with crop name, code, payment rate (Rs / kg), and description.
   - Update payment rates (`PATCH /crops/:id`).
   - Delete crops (`DELETE /crops/:id`).
   - Add standard Sri Lankan crops with one click.
2. **Owners Directory**:
   - View all registered owners (`GET /owners`).
   - Toggle status (Active / Inactive, `PATCH /owners/:id`).
   - Delete owner accounts (`DELETE /owners/:id`).
3. **Estates**:
   - View all estates across all owners (`GET /estates`).
   - View estate boundaries on OpenStreetMap ([`AdminEstateModal.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/admin/AdminEstateModal.jsx)).
   - Edit estate details (name, code, crop, owner, status) using [`EditEstateModal.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/estates/EditEstateModal.jsx).
   - Delete estates safely with cascade removal via [`ConfirmDialog.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/ui/confirm-dialog.jsx).
   - **Workforce shortcut**: One-click "Workforce" button on each estate row jumps directly to the filtered workforce view for that estate (`/admin/employees?estateId=:id`).
4. **Workforce Directory & Estate Selector**:
   - Filter workforce members by specific estate using the estate dropdown or URL query parameter (`?estateId=:id`).
   - Active estate context banner displays the selected estate's name, code, crop type, owner details, and member count, with a one-click button to clear back to all estates.
   - Filter by role (Workers vs Supervisors).
   - Search by name, employee code, NIC, phone, or owner.
   - Edit employee roles, estate assignments, and details using [`EditEmployeeModal.jsx`](file:///c:/Users/thson/Desktop/estate360/frontend/src/components/forms/EditEmployeeModal.jsx).
   - Delete employees with confirmation dialog.
5. **IoT Devices**:
   - View and register devices (`GET /iot/devices`, `POST /iot/devices`).
   - Trigger data sync from the cloud (`POST /iot/cloud/sync`).
6. **Admins**:
   - Add other administrator accounts (`POST /auth/admin/create-admin`).
   - Quick setup for the first admin account.

