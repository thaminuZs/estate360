# Estate 360 — Core API

> Scalable enterprise backend services for the Estate 360 Smart Plantation Management Platform.

---

## 1. Overview

The **Estate 360 Core API** is built on [NestJS](https://nestjs.com/) and provides foundational services for plantation owners, field workers, supervisors, administrators, and IoT edge devices across Sri Lankan agricultural estates.

The service handles geospatial land parcel management, workforce operations, crop harvesting yields, daily attendance, automated payroll computation, and IoT telemetry ingestion.

---

## 2. Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript 5.7 (Node.js runtime v24)
- **Database & ORM**: PostgreSQL 16 with PostGIS extension, managed via [TypeORM](https://typeorm.io/)
- **Authentication**: JWT with Access & Refresh Token rotation, bcrypt password hashing, and role-based guards (`OWNER`, `ADMIN`)
- **Documentation**: [Compodoc](https://compodoc.app/) & OpenAPI / Swagger
- **Geospatial Processing**: PostGIS GeoJSON Polygons (`PolygonDto`, `PointDto`, geodesic boundary validation)

---

## 3. Architecture & Core Modules

```
services/core-api/src/
├── app.module.ts              # Root NestJS application module
├── main.ts                    # Bootstrap entry point with global validation pipes
├── auth/                      # Authentication, JWT rotation, roles guards, password hashing
├── owners/                    # Plantation owner registry, account lifecycles
├── estates/                   # Estate boundaries, PostGIS polygon mapping, crop associations
├── crop/                      # Agricultural crops directory & pricing factors (Rs/kg)
├── employees/                 # Field workers and supervisors directory
├── assignments/               # Worker and supervisor estate allocation mappings
├── attendance/                # Check-in and check-out tracking for field personnel
├── work-sessions/             # Shift logging, active harvesting sessions
├── production/                # Harvest yield logging and daily weigh-in records
├── payroll/                   # Automated wage computation based on yield and pay rates
├── payment-details/           # Bank accounts and disbursement details
└── iot/                       # Telemetry ingestion for sensors and beacon tracking
```

### Module Breakdown

| Module | Controllers / Routes | Entities | Purpose |
|---|---|---|---|
| **Auth** | `/auth/register`, `/auth/login`, `/auth/refresh-token`, `/auth/admin/create-admin` | `User` | User credential management, role-based access control (`ADMIN` vs `OWNER`), and JWT validation. |
| **Owners** | `/owners`, `/owners/:id` | `Owner` | Plantation owner profiles, contact details, account activation status, and linked estates. |
| **Estates** | `/estates`, `/estates/:id` | `Estate` | Land parcels with PostGIS boundary polygons, assigned crops, and owner linkage. |
| **Crop** | `/crops`, `/crops/:id` | `Crop` | Commercial crops catalog (Tea, Rubber, Coconut, Cinnamon, Pepper) with base payment factors. |
| **Employees** | `/employees`, `/employees/:id` | `Employee` | Workforce personnel directory with NIC, role (`worker`, `supervisor`), phone, and owner affiliation. |
| **Assignments**| `/assignments/estate`, `/assignments/worker` | `EstateAssignment`, `WorkerAssignment` | Allocation of supervisors and harvesters to designated estates and fields. |
| **Attendance** | `/attendance/check-in`, `/attendance/check-out` | `Attendance` | Shift clock-in/out records with supervisor verification and timestamp auditing. |
| **Work Sessions** | `/work-sessions/start`, `/work-sessions/:id/end` | `WorkSession` | Real-time harvest shift recording, active duration, and supervisor oversight. |
| **Production** | `/production/record`, `/production/estate/:id` | `ProductionRecord` | Harvest collection tracking by weight (kg), quality grade, and plucker attribution. |
| **Payroll** | `/payroll/generate`, `/payroll/estate/:id` | `Payroll`, `PayrollItem` | Calculation of piece-rate pay, base allowances, and net salary disbursement batches. |
| **Payment Details** | `/payment-details`, `/payment-details/:id` | `EmployeePaymentDetail` | Banking details, branch codes, and settlement accounts for employees. |
| **IoT** | `/iot/devices`, `/iot/readings`, `/iot/cloud/sync` | `Device`, `DeviceAssignment`, `EnvironmentIotReading`, `WorkerIotReading` | Edge gateway integration, environmental telemetry, and beacon location sync. |

---

## 4. Compodoc Documentation

Compodoc generates comprehensive, interactive documentation for the entire codebase including:
- Interactive dependency graph diagrams for all modules (`AppModule`, `EstatesModule`, etc.)
- Controller route tables and HTTP methods
- Injectable provider dependency trees
- Entity schema definitions and TypeORM column mappings
- Data Transfer Objects (DTO) class hierarchies and validation rules
- JSDoc docstrings and parameter documentation

### Available Documentation Commands

```bash
# Generate static documentation into ./documentation
npm run doc

# Generate and start a local documentation server on port 8080
npm run doc:serve

# Check documentation coverage metrics across classes and methods
npm run doc:coverage

# Export machine-readable metadata schema in JSON format
npm run doc:json
```

When running `npm run doc:serve`, browse the documentation at:
```text
http://localhost:8080
```

---

## 5. Development & Environment Setup

### 5.1 Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Ensure PostgreSQL with PostGIS is available and configure connection parameters:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=estate360
JWT_SECRET=your_jwt_secret
```

### 5.2 Build & Execution

```bash
# Install dependencies
npm install

# Build TypeScript codebase
npm run build

# Start in development watch mode
npm run start:dev

# Run lint checks
npm run lint

# Run unit tests
npm run test
```
