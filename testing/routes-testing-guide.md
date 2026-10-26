# Estate 360 - API Testing & Route Examples Guide

Backend Base URL: `http://localhost:3000`  
Default Port: `3000`  
Authentication: HTTP Bearer Token (`Authorization: Bearer <JWT_ACCESS_TOKEN>`)

---

## Table of Contents
1. [Test Setup & Authentication Flow](#1-test-setup--authentication-flow)
2. [Health Check Route](#2-health-check-route)
3. [Authentication Routes (`/auth`)](#3-authentication-routes-auth)
4. [Owner Management Routes (`/owners`)](#4-owner-management-routes-owners)
5. [Crop Management Routes (`/crops`)](#5-crop-management-routes-crops)
6. [Estate Management Routes (`/estates`)](#6-estate-management-routes-estates)
7. [Employee Management Routes (`/employees`)](#7-employee-management-routes-employees)
8. [Assignment Routes (`/assignments`)](#8-assignment-routes-assignments)
9. [Employee Payment Details Routes (`/payment-details`)](#9-employee-payment-details-routes-payment-details)
10. [IoT & Telemetry Routes (`/iot`)](#10-iot--telemetry-routes-iot)
11. [Work Session Routes (`/work-sessions`)](#11-work-session-routes-work-sessions)
12. [Attendance Routes (`/attendance`)](#12-attendance-routes-attendance)
13. [Production Records Routes (`/production`)](#13-production-records-routes-production)
14. [Payroll & Payment Routes (`/payroll`)](#14-payroll--payment-routes-payroll)

---

## 1. Test Setup & Authentication Flow

Most endpoints require a valid JWT Bearer token with the appropriate role (`admin`, `owner`, `supervisor`).

### Quick Start: Obtain a Token
1. Run `POST /auth/register` or `POST /auth/login` to obtain an `accessToken`.
2. Export your token in your terminal:
   ```bash
   # Bash / macOS / Linux
   export TOKEN="<YOUR_ACCESS_TOKEN>"

   # PowerShell (Windows)
   $TOKEN = "<YOUR_ACCESS_TOKEN>"
   ```
3. Include the header in your requests:
   ```http
   Authorization: Bearer <YOUR_ACCESS_TOKEN>
   Content-Type: application/json
   ```

---

## 2. Health Check Route

### `GET /`
- **Role**: Public
- **Description**: Verifies the core API server is running.
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/
  ```
- **Expected Response (`200 OK`)**:
  ```text
  Hello World!
  ```

---

## 3. Authentication Routes (`/auth`)

### 3.1 `POST /auth/register`
- **Role**: Public
- **Description**: Registers a new user and linked Owner profile. Password requires at least 8 characters, with 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.
- **JSON Payload**:
  ```json
  {
    "email": "owner@highvalley.com",
    "password": "OwnerPass123!",
    "name": "High Valley Plantations",
    "phone": "+94771234567",
    "address": "12 Nuwara Eliya Road, Kandy",
    "role": "owner"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "owner@highvalley.com",
      "password": "OwnerPass123!",
      "name": "High Valley Plantations",
      "phone": "+94771234567",
      "address": "12 Nuwara Eliya Road, Kandy",
      "role": "owner"
    }'
  ```
- **Expected Response (`201 Created`)**:
  ```json
  {
    "id": "e2f1a6c4-2d93-4e4b-97e3-0d31dfbb1a01",
    "email": "owner@highvalley.com",
    "role": "owner",
    "status": "active"
  }
  ```

### 3.2 `POST /auth/login`
- **Role**: Public
- **Description**: Validates credentials and returns JWT access & refresh tokens.
- **JSON Payload**:
  ```json
  {
    "email": "owner@highvalley.com",
    "password": "OwnerPass123!"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "owner@highvalley.com",
      "password": "OwnerPass123!"
    }'
  ```
- **Expected Response (`200 OK`)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### 3.3 `POST /auth/refresh-token`
- **Role**: Public
- **Description**: Renews an expired access token using the valid refresh token.
- **JSON Payload**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/auth/refresh-token \
    -H "Content-Type: application/json" \
    -d '{
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }'
  ```
- **Expected Response (`200 OK`)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### 3.4 `GET /auth/me`
- **Role**: Authenticated (`admin`, `owner`, `supervisor`, `manager`)
- **Description**: Returns profile details for the currently authenticated user.
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/auth/me \
    -H "Authorization: Bearer $TOKEN"
  ```
- **Expected Response (`200 OK`)**:
  ```json
  {
    "id": "e2f1a6c4-2d93-4e4b-97e3-0d31dfbb1a01",
    "email": "owner@highvalley.com",
    "role": "owner",
    "owner": {
      "id": "b1a45678-1234-4a5b-9cde-f1234567890a",
      "name": "High Valley Plantations",
      "email": "owner@highvalley.com",
      "phone": "+94771234567",
      "address": "12 Nuwara Eliya Road, Kandy"
    }
  }
  ```

### 3.5 `POST /auth/admin/create-admin`
- **Role**: `admin`
- **Description**: Creates a new administrator account.
- **JSON Payload**:
  ```json
  {
    "email": "superadmin@estate360.com",
    "password": "AdminSecure999!",
    "name": "Chief Executive Admin",
    "phone": "+94711122334"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/auth/admin/create-admin \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "superadmin@estate360.com",
      "password": "AdminSecure999!",
      "name": "Chief Executive Admin",
      "phone": "+94711122334"
    }'
  ```

---

## 4. Owner Management Routes (`/owners`)

### 4.1 `POST /owners`
- **Role**: Public or `admin`
- **Description**: Registers an owner directly via the Owners module.
- **JSON Payload**:
  ```json
  {
    "name": "Sirisena Tea Holdings",
    "email": "sirisena@teaholdings.lk",
    "password": "OwnerSecret#2026",
    "phone": "+94779876543",
    "address": "Tea Estate Road, Hatton",
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/owners \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Sirisena Tea Holdings",
      "email": "sirisena@teaholdings.lk",
      "password": "OwnerSecret#2026",
      "phone": "+94779876543",
      "address": "Tea Estate Road, Hatton",
      "status": "ACTIVE"
    }'
  ```

### 4.2 `GET /owners`
- **Role**: `admin`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/owners \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  ```

### 4.3 `GET /owners/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/owners/b1a45678-1234-4a5b-9cde-f1234567890a \
    -H "Authorization: Bearer $TOKEN"
  ```

### 4.4 `PATCH /owners/:id`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "name": "Sirisena Tea & Spice Estates PLC",
    "phone": "+94772223344",
    "address": "45 Hatton Main Road, Hatton",
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/owners/b1a45678-1234-4a5b-9cde-f1234567890a \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Sirisena Tea & Spice Estates PLC",
      "phone": "+94772223344",
      "address": "45 Hatton Main Road, Hatton",
      "status": "ACTIVE"
    }'
  ```

### 4.5 `DELETE /owners/:id`
- **Role**: `admin`
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:3000/owners/b1a45678-1234-4a5b-9cde-f1234567890a \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  ```

---

## 5. Crop Management Routes (`/crops`)

### 5.1 `POST /crops`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "name": "Ceylon Black Tea",
    "code": "CROP-TEA-01",
    "paymentFactor": 1.25,
    "description": "Premium high-grown orthodox tea cultivar"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/crops \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Ceylon Black Tea",
      "code": "CROP-TEA-01",
      "paymentFactor": 1.25,
      "description": "Premium high-grown orthodox tea cultivar"
    }'
  ```

### 5.2 `GET /crops`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/crops \
    -H "Authorization: Bearer $TOKEN"
  ```

### 5.3 `GET /crops/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/crops/c3f4e123-5678-4a9b-bcde-0123456789ab \
    -H "Authorization: Bearer $TOKEN"
  ```

### 5.4 `PATCH /crops/:id`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "name": "Ceylon Black Tea (Grade A)",
    "paymentFactor": 1.35,
    "description": "Updated high-grown cultivar factor"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/crops/c3f4e123-5678-4a9b-bcde-0123456789ab \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Ceylon Black Tea (Grade A)",
      "paymentFactor": 1.35,
      "description": "Updated high-grown cultivar factor"
    }'
  ```

### 5.5 `DELETE /crops/:id`
- **Role**: `admin`
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:3000/crops/c3f4e123-5678-4a9b-bcde-0123456789ab \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  ```

---

## 6. Estate Management Routes (`/estates`)

### 6.1 `POST /estates`
- **Role**: `admin`, `owner`
- **Description**: Registers an estate with PostGIS central `location` (Point) and cadastral `boundary` (Polygon). Coordinates format is `[longitude, latitude]`.
- **JSON Payload**:
  ```json
  {
    "name": "Green Valley Highlands",
    "code": "GV-TEA-001",
    "ownerId": "b1a45678-1234-4a5b-9cde-f1234567890a",
    "cropId": "c3f4e123-5678-4a9b-bcde-0123456789ab",
    "location": {
      "type": "Point",
      "coordinates": [80.6337, 6.9497]
    },
    "boundary": {
      "type": "Polygon",
      "coordinates": [
        [
          [80.6300, 6.9450],
          [80.6400, 6.9450],
          [80.6400, 6.9550],
          [80.6300, 6.9550],
          [80.6300, 6.9450]
        ]
      ]
    },
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/estates \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Green Valley Highlands",
      "code": "GV-TEA-001",
      "ownerId": "b1a45678-1234-4a5b-9cde-f1234567890a",
      "cropId": "c3f4e123-5678-4a9b-bcde-0123456789ab",
      "location": {
        "type": "Point",
        "coordinates": [80.6337, 6.9497]
      },
      "boundary": {
        "type": "Polygon",
        "coordinates": [
          [
            [80.6300, 6.9450],
            [80.6400, 6.9450],
            [80.6400, 6.9550],
            [80.6300, 6.9550],
            [80.6300, 6.9450]
          ]
        ]
      },
      "status": "ACTIVE"
    }'
  ```

### 6.2 `GET /estates`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/estates \
    -H "Authorization: Bearer $TOKEN"
  ```

### 6.3 `GET /estates/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/estates/d4e5f678-90ab-4cde-ef12-34567890abcd \
    -H "Authorization: Bearer $TOKEN"
  ```

### 6.4 `PATCH /estates/:id`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "name": "Green Valley Highlands (West Wing)",
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/estates/d4e5f678-90ab-4cde-ef12-34567890abcd \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Green Valley Highlands (West Wing)",
      "status": "ACTIVE"
    }'
  ```

### 6.5 `DELETE /estates/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:3000/estates/d4e5f678-90ab-4cde-ef12-34567890abcd \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## 7. Employee Management Routes (`/employees`)

### 7.1 `POST /employees`
- **Role**: `admin`
- **Description**: Registers a field employee or supervisor. `nic` requires valid Sri Lankan NIC (`199012345678` or `901234567V`).
- **JSON Payload**:
  ```json
  {
    "employeeCode": "EMP-0042",
    "firstName": "Kamal",
    "lastName": "Perera",
    "nic": "199214502341",
    "phone": "+94775551234",
    "address": "Camp Line 3, Green Valley, Hatton",
    "dateOfBirth": "1992-05-14",
    "dateJoined": "2024-01-15",
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/employees \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "employeeCode": "EMP-0042",
      "firstName": "Kamal",
      "lastName": "Perera",
      "nic": "199214502341",
      "phone": "+94775551234",
      "address": "Camp Line 3, Green Valley, Hatton",
      "dateOfBirth": "1992-05-14",
      "dateJoined": "2024-01-15",
      "status": "ACTIVE"
    }'
  ```

### 7.2 `GET /employees`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/employees \
    -H "Authorization: Bearer $TOKEN"
  ```

### 7.3 `GET /employees/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/employees/f5e6d7c8-9012-4321-ba98-76543210fedc \
    -H "Authorization: Bearer $TOKEN"
  ```

### 7.4 `PATCH /employees/:id`
- **Role**: `admin`
- **JSON Payload**:
  ```json
  {
    "phone": "+94778889900",
    "address": "New Staff Quarters, Hatton",
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/employees/f5e6d7c8-9012-4321-ba98-76543210fedc \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "phone": "+94778889900",
      "address": "New Staff Quarters, Hatton",
      "status": "ACTIVE"
    }'
  ```

### 7.5 `DELETE /employees/:id`
- **Role**: `admin`
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:3000/employees/f5e6d7c8-9012-4321-ba98-76543210fedc \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  ```

---

## 8. Assignment Routes (`/assignments`)

### 8.1 Estate Assignments (Managers & Supervisors)

#### `POST /assignments/estate`
- **Role**: `admin`, `owner`
- **Roles accepted**: `MANAGER`, `SUPERVISOR`
- **JSON Payload**:
  ```json
  {
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "employeeId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "role": "SUPERVISOR",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/assignments/estate \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "employeeId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "role": "SUPERVISOR",
      "startDate": "2026-01-01",
      "endDate": "2026-12-31"
    }'
  ```

#### `GET /assignments/estate`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/assignments/estate \
    -H "Authorization: Bearer $TOKEN"
  ```

#### `GET /assignments/estate/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/assignments/estate/a1111111-2222-3333-4444-555555555555 \
    -H "Authorization: Bearer $TOKEN"
  ```

#### `PATCH /assignments/estate/:id`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "role": "MANAGER",
    "endDate": "2027-12-31"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/assignments/estate/a1111111-2222-3333-4444-555555555555 \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "MANAGER",
      "endDate": "2027-12-31"
    }'
  ```

#### `DELETE /assignments/estate/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:3000/assignments/estate/a1111111-2222-3333-4444-555555555555 \
    -H "Authorization: Bearer $TOKEN"
  ```

### 8.2 Worker Assignments (Field Workers)

#### `POST /assignments/worker`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "supervisorId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "startDate": "2026-02-01",
    "endDate": "2026-12-31"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/assignments/worker \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "supervisorId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "startDate": "2026-02-01",
      "endDate": "2026-12-31"
    }'
  ```

#### `GET /assignments/worker`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/assignments/worker \
    -H "Authorization: Bearer $TOKEN"
  ```

#### `GET /assignments/worker/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/assignments/worker/w2222222-3333-4444-5555-666666666666 \
    -H "Authorization: Bearer $TOKEN"
  ```

#### `PATCH /assignments/worker/:id`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "endDate": "2027-01-31"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/assignments/worker/w2222222-3333-4444-5555-666666666666 \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "endDate": "2027-01-31"
    }'
  ```

#### `DELETE /assignments/worker/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X DELETE http://localhost:3000/assignments/worker/w2222222-3333-4444-5555-666666666666 \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## 9. Employee Payment Details Routes (`/payment-details`)

### 9.1 `POST /payment-details`
- **Role**: `admin`
- **JSON Payload**:
  ```json
  {
    "employeeId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "paymentFrequency": "BI_WEEKLY",
    "bankName": "Bank of Ceylon",
    "accountNumber": "00765432198",
    "accountName": "K. Perera",
    "branch": "Hatton Branch",
    "isActive": true
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/payment-details \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "employeeId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "paymentFrequency": "BI_WEEKLY",
      "bankName": "Bank of Ceylon",
      "accountNumber": "00765432198",
      "accountName": "K. Perera",
      "branch": "Hatton Branch",
      "isActive": true
    }'
  ```

### 9.2 `GET /payment-details`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/payment-details \
    -H "Authorization: Bearer $TOKEN"
  ```

### 9.3 `GET /payment-details/employee/:employeeId`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/payment-details/employee/f5e6d7c8-9012-4321-ba98-76543210fedc \
    -H "Authorization: Bearer $TOKEN"
  ```

### 9.4 `PATCH /payment-details/:id`
- **Role**: `admin`
- **JSON Payload**:
  ```json
  {
    "paymentFrequency": "MONTHLY",
    "bankName": "Commercial Bank of Ceylon",
    "accountNumber": "8899001122",
    "branch": "Nuwara Eliya Branch",
    "isActive": true
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/payment-details/p3333333-4444-5555-6666-777777777777 \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "paymentFrequency": "MONTHLY",
      "bankName": "Commercial Bank of Ceylon",
      "accountNumber": "8899001122",
      "branch": "Nuwara Eliya Branch",
      "isActive": true
    }'
  ```

---

## 10. IoT & Telemetry Routes (`/iot`)

### 10.1 `POST /iot/devices`
- **Role**: `admin`
- **Description**: Registers an IoT badge or weather sensor.
- **JSON Payload**:
  ```json
  {
    "deviceCode": "LORA-BADGE-101",
    "deviceType": "WORKER_BADGE",
    "status": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/iot/devices \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "deviceCode": "LORA-BADGE-101",
      "deviceType": "WORKER_BADGE",
      "status": "ACTIVE"
    }'
  ```

### 10.2 `GET /iot/devices`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/iot/devices \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.3 `GET /iot/devices/:id`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/iot/devices/e4444444-5555-6666-7777-888888888888 \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.4 `POST /iot/assignments`
- **Role**: `admin`, `owner`
- **Description**: Assigns a device to a worker and estate.
- **JSON Payload**:
  ```json
  {
    "deviceId": "e4444444-5555-6666-7777-888888888888",
    "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "startDate": "2026-03-01",
    "endDate": "2026-12-31"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/iot/assignments \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "deviceId": "e4444444-5555-6666-7777-888888888888",
      "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "startDate": "2026-03-01",
      "endDate": "2026-12-31"
    }'
  ```

### 10.5 `GET /iot/assignments`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/iot/assignments \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.6 `POST /iot/readings/worker`
- **Role**: `admin`
- **Description**: Ingests worker IoT telemetry reading.
- **JSON Payload**:
  ```json
  {
    "deviceId": "e4444444-5555-6666-7777-888888888888",
    "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "workSessionId": "s7777777-8888-9999-aaaa-bbbbbbbbbbbb",
    "recordedAt": "2026-03-15T08:30:00Z",
    "location": {
      "latitude": 6.9497,
      "longitude": 80.6337
    },
    "activityStatus": "ACTIVE"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/iot/readings/worker \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "deviceId": "e4444444-5555-6666-7777-888888888888",
      "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "workSessionId": "s7777777-8888-9999-aaaa-bbbbbbbbbbbb",
      "recordedAt": "2026-03-15T08:30:00Z",
      "location": {
        "latitude": 6.9497,
        "longitude": 80.6337
      },
      "activityStatus": "ACTIVE"
    }'
  ```

### 10.7 `GET /iot/readings/worker`
- **Role**: `admin`, `owner`
- **Query Params**: `estateId`, `workerId`, `sessionId`, `limit`
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/iot/readings/worker?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&limit=25" \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.8 `POST /iot/readings/environment`
- **Role**: `admin`
- **JSON Payload**:
  ```json
  {
    "deviceId": "e4444444-5555-6666-7777-888888888888",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "recordedAt": "2026-03-15T08:30:00Z",
    "temperature": 24.5,
    "humidity": 82.0,
    "soilMoisture": 45.2,
    "location": {
      "latitude": 6.9497,
      "longitude": 80.6337
    }
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/iot/readings/environment \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "deviceId": "e4444444-5555-6666-7777-888888888888",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "recordedAt": "2026-03-15T08:30:00Z",
      "temperature": 24.5,
      "humidity": 82.0,
      "soilMoisture": 45.2,
      "location": {
        "latitude": 6.9497,
        "longitude": 80.6337
      }
    }'
  ```

### 10.9 `GET /iot/readings/environment`
- **Role**: `admin`, `owner`
- **Query Params**: `estateId`, `deviceId`, `limit`
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/iot/readings/environment?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&limit=25" \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.10 `GET /iot/cloud/config`
- **Role**: `admin`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/iot/cloud/config \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  ```

### 10.11 `PATCH /iot/cloud/config`
- **Role**: `admin`
- **Description**: Updates runtime cloud server fetch configuration.
- **JSON Payload**:
  ```json
  {
    "cloudBaseUrl": "https://api.cloud-telemetry.estate360.internal",
    "workerEndpoint": "/v1/worker-telemetry",
    "environmentEndpoint": "/v1/env-telemetry",
    "apiKey": "secure-live-cloud-api-key-2026",
    "pollIntervalMs": 30000,
    "isEnabled": true
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/iot/cloud/config \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "cloudBaseUrl": "https://api.cloud-telemetry.estate360.internal",
      "workerEndpoint": "/v1/worker-telemetry",
      "environmentEndpoint": "/v1/env-telemetry",
      "apiKey": "secure-live-cloud-api-key-2026",
      "pollIntervalMs": 30000,
      "isEnabled": true
    }'
  ```

### 10.12 `POST /iot/cloud/sync`
- **Role**: `admin`, `owner`
- **Description**: Triggers manual sync for both worker & environmental readings.
- **cURL Example**:
  ```bash
  curl -X POST "http://localhost:3000/iot/cloud/sync?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&limit=50" \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.13 `POST /iot/cloud/sync/worker`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X POST "http://localhost:3000/iot/cloud/sync/worker?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&limit=50" \
    -H "Authorization: Bearer $TOKEN"
  ```

### 10.14 `POST /iot/cloud/sync/environment`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X POST "http://localhost:3000/iot/cloud/sync/environment?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&limit=50" \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## 11. Work Session Routes (`/work-sessions`)

### 11.1 `POST /work-sessions`
- **Role**: `admin`, `owner`, `supervisor`
- **Description**: Starts an active shift work session for a worker in an estate.
- **JSON Payload**:
  ```json
  {
    "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "startTime": "2026-03-15T07:00:00Z",
    "status": "IN_PROGRESS"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/work-sessions \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "startTime": "2026-03-15T07:00:00Z",
      "status": "IN_PROGRESS"
    }'
  ```

### 11.2 `PATCH /work-sessions/:id/end`
- **Role**: `admin`, `owner`, `supervisor`
- **Description**: Closes the work session.
- **JSON Payload**:
  ```json
  {
    "endTime": "2026-03-15T16:00:00Z",
    "status": "COMPLETED"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/work-sessions/s7777777-8888-9999-aaaa-bbbbbbbbbbbb/end \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "endTime": "2026-03-15T16:00:00Z",
      "status": "COMPLETED"
    }'
  ```

### 11.3 `GET /work-sessions`
- **Role**: `admin`, `owner`, `supervisor`
- **Query Params**: `workerId`, `estateId`, `status`
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/work-sessions?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&status=IN_PROGRESS" \
    -H "Authorization: Bearer $TOKEN"
  ```

### 11.4 `GET /work-sessions/:id`
- **Role**: `admin`, `owner`, `supervisor`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/work-sessions/s7777777-8888-9999-aaaa-bbbbbbbbbbbb \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## 12. Attendance Routes (`/attendance`)

### 12.1 `POST /attendance/check-in`
- **Role**: `admin`, `owner`, `supervisor`
- **Description**: Registers a daily check-in for a worker.
- **JSON Payload**:
  ```json
  {
    "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "date": "2026-03-15",
    "checkIn": "2026-03-15T06:45:00Z",
    "status": "PRESENT"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/attendance/check-in \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "date": "2026-03-15",
      "checkIn": "2026-03-15T06:45:00Z",
      "status": "PRESENT"
    }'
  ```

### 12.2 `PATCH /attendance/:id/check-out`
- **Role**: `admin`, `owner`, `supervisor`
- **JSON Payload**:
  ```json
  {
    "checkOut": "2026-03-15T16:30:00Z",
    "status": "COMPLETED"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/attendance/att11111-2222-3333-4444-555555555555/check-out \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "checkOut": "2026-03-15T16:30:00Z",
      "status": "COMPLETED"
    }'
  ```

### 12.3 `GET /attendance`
- **Role**: `admin`, `owner`, `supervisor`
- **Query Params**: `workerId`, `estateId`, `date`
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/attendance?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd&date=2026-03-15" \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## 13. Production Records Routes (`/production`)

### 13.1 `POST /production`
- **Role**: `admin`, `owner`, `supervisor`
- **Description**: Records harvest crop kilograms or units harvested by a worker during an active work session.
- **JSON Payload**:
  ```json
  {
    "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "workSessionId": "s7777777-8888-9999-aaaa-bbbbbbbbbbbb",
    "quantity": 28.5,
    "unit": "kg",
    "recordedAt": "2026-03-15T15:45:00Z"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/production \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "workerId": "f5e6d7c8-9012-4321-ba98-76543210fedc",
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "workSessionId": "s7777777-8888-9999-aaaa-bbbbbbbbbbbb",
      "quantity": 28.5,
      "unit": "kg",
      "recordedAt": "2026-03-15T15:45:00Z"
    }'
  ```

### 13.2 `GET /production`
- **Role**: `admin`, `owner`, `supervisor`
- **Query Params**: `workerId`, `estateId`, `workSessionId`
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/production?estateId=d4e5f678-90ab-4cde-ef12-34567890abcd" \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## 14. Payroll & Payment Routes (`/payroll`)

### 14.1 Pay Rates Configuration

#### `POST /payroll/rates`
- **Role**: `admin`, `owner`
- **JSON Payload**:
  ```json
  {
    "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
    "rate": 45.0,
    "unit": "kg",
    "paymentFactor": 1.25,
    "effectiveFrom": "2026-01-01",
    "effectiveTo": "2026-12-31"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/payroll/rates \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "estateId": "d4e5f678-90ab-4cde-ef12-34567890abcd",
      "rate": 45.0,
      "unit": "kg",
      "paymentFactor": 1.25,
      "effectiveFrom": "2026-01-01",
      "effectiveTo": "2026-12-31"
    }'
  ```

#### `GET /payroll/rates/estate/:estateId`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/payroll/rates/estate/d4e5f678-90ab-4cde-ef12-34567890abcd \
    -H "Authorization: Bearer $TOKEN"
  ```

### 14.2 Payroll Generation & Processing

#### `POST /payroll/generate`
- **Role**: `admin`, `owner`
- **Description**: Generates gross pay, production pay, and deductions for all estate workers in the period.
- **JSON Payload**:
  ```json
  {
    "ownerId": "b1a45678-1234-4a5b-9cde-f1234567890a",
    "periodStart": "2026-03-01",
    "periodEnd": "2026-03-15",
    "paymentFrequency": "BI_WEEKLY"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/payroll/generate \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "ownerId": "b1a45678-1234-4a5b-9cde-f1234567890a",
      "periodStart": "2026-03-01",
      "periodEnd": "2026-03-15",
      "paymentFrequency": "BI_WEEKLY"
    }'
  ```

#### `GET /payroll`
- **Role**: `admin`, `owner`
- **Query Params**: `ownerId`
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/payroll?ownerId=b1a45678-1234-4a5b-9cde-f1234567890a" \
    -H "Authorization: Bearer $TOKEN"
  ```

#### `GET /payroll/:id`
- **Role**: `admin`, `owner`
- **Description**: Returns payroll overview with breakdown of individual payroll items.
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/payroll/pr111111-2222-3333-4444-555555555555 \
    -H "Authorization: Bearer $TOKEN"
  ```

#### `PATCH /payroll/:id/process`
- **Role**: `admin`, `owner`
- **Description**: Transitions payroll status from `PENDING` to `PROCESSED`.
- **JSON Payload**: (Empty object or no body required)
  ```json
  {}
  ```
- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/payroll/pr111111-2222-3333-4444-555555555555/process \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{}'
  ```

### 14.3 Payments Disbursement

#### `POST /payroll/payments`
- **Role**: `admin`, `owner`
- **Description**: Records bank payout transaction for a payroll line item.
- **JSON Payload**:
  ```json
  {
    "payrollItemId": "pri22222-3333-4444-5555-666666666666",
    "amount": 34850.0,
    "paymentDate": "2026-03-18T10:00:00Z",
    "bankName": "Bank of Ceylon",
    "accountNumber": "00765432198",
    "accountName": "K. Perera",
    "transactionReference": "TXN-BOC-20260318-0042",
    "status": "COMPLETED"
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/payroll/payments \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "payrollItemId": "pri22222-3333-4444-5555-666666666666",
      "amount": 34850.0,
      "paymentDate": "2026-03-18T10:00:00Z",
      "bankName": "Bank of Ceylon",
      "accountNumber": "00765432198",
      "accountName": "K. Perera",
      "transactionReference": "TXN-BOC-20260318-0042",
      "status": "COMPLETED"
    }'
  ```

#### `GET /payroll/payments/all`
- **Role**: `admin`, `owner`
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/payroll/payments/all \
    -H "Authorization: Bearer $TOKEN"
  ```
