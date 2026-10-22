# 🌿 Estate360

> **University of Vavuniya — Group Project**
> A smart estate management system that combines IoT-based worker tracking with a full-stack web platform for real-time monitoring and management of agricultural estates.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [System Design](#system-design)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Team Members](#team-members)
- [License](#license)

---

## 📖 Project Overview

**Estate360** is an integrated smart estate management platform designed for agricultural estates. It enables estate owners to manage their properties, employees, crop data, and payments — while tracking field worker locations and activity in real time using custom-built IoT devices.

Worker devices (ESP32-based) collect GPS coordinates and motion data, transmit them over **LoRa** to a base station, which then forwards the data to the backend. The web dashboard provides a live map view of all workers alongside full estate management features.

---

## 🎯 Objectives

- Provide a centralized dashboard for managing estates, owners, employees, and crops
- Enable real-time GPS tracking of field workers using IoT devices
- Monitor worker activity levels (Resting / Low Movement / Active) using accelerometer data
- Persist and visualize worker location data through a dedicated analytics service
- Deliver a responsive, modern web interface for estate owners and administrators

---

## 🏗️ System Design

```
┌────────────────────────────────────────────────────────────────────┐
│                         Estate360 System                           │
│                                                                    │
│  ┌───────────────┐       LoRa        ┌──────────────────────────┐  │
│  │  Worker Device│  ──────────────►  │      Base Station        │  │
│  │  (ESP32)      │                   │      (ESP32)             │  │
│  │  - GPS Module │                   │  - Receives LoRa packets │  │
│  │  - MPU6050    │                   │  - Forwards to backend   │  │
│  │  - LoRa E32   │                   └──────────┬───────────────┘  │
│  └───────────────┘                              │ HTTP/Serial      │
│                                                 ▼                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                        Backend Services                      │  │
│  │                                                              │  │
│  │   ┌─────────────────────┐    ┌──────────────────────────┐    │  │
│  │   │     Core API        │    │     Analytics API        │    │  │
│  │   │  (NestJS + TypeORM) │    │    (Node.js + MongoDB)   │    │  │
│  │   │  - Auth             │    │  - GPS coordinates store │    │  │
│  │   │  - Owners           │    │  - Map data persistence  │    │  │
│  │   │  - Estates          │    └──────────────────────────┘    │  │
│  │   │  - Employees        │                                    │  │
│  │   │  - Crops            │              PostgreSQL            │  │
│  │   │  - Assignments      │    ◄──────────────────────────     │  │
│  │   │  - Payments         │                                    │  │
│  │   └─────────────────────┘                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                 ▲                                  │
│                          REST API calls                            │
│                                 │                                  │
│  ┌──────────────────────────────┴───────────────────────────────┐  │
│  │                   Frontend (React + Vite)                    │  │
│  │             - Estate & employee dashboard                    │  │
│  │             - Live worker map view                           │  │
│  │             - Crop & payment management                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| ESLint | 10 | Code linting |

### Backend — Core API
| Technology | Version | Purpose |
|---|---|---|
| NestJS | 11 | Backend framework |
| TypeORM | 1.x | ORM |
| PostgreSQL | — | Relational database |
| TypeScript | 5.x | Language |

### Backend — Analytics API
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| MongoDB | GPS coordinates persistence |

### IoT
| Component | Purpose |
|---|---|
| ESP32 | Microcontroller (Worker Device & Base Station) |
| NEO-M8N GPS | Location acquisition |
| MPU6050 | Accelerometer — worker activity detection |
| LoRa E32 | Long-range wireless communication |
| TinyGPS++ | GPS NMEA parsing library |
| Adafruit MPU6050 | IMU sensor library |

---

## 📁 Project Structure

```
estate360/
├── frontend/                   # React + Vite web application
│   ├── src/                    # Application source code
│   ├── public/                 # Static assets
│   └── package.json
│
├── services/
│   ├── core-api/               # NestJS REST API (PostgreSQL)
│   │   └── src/
│   │       ├── auth/           # Authentication
│   │       ├── owners/         # Estate owner management
│   │       ├── estates/        # Estate management
│   │       ├── employees/      # Employee management
│   │       ├── crop/           # Crop management
│   │       ├── assignments/    # Estate & worker assignments
│   │       └── payment-details/# Payment management
│   │
│   └── analytics-api/          # Analytics service (MongoDB)
│       └── .env                # MongoDB connection config
│
├── iot/
│   ├── worker_device/          # ESP32 worker device firmware
│   │   └── worker_device.ino   # GPS + IMU + LoRa transmitter
│   └── base_station/           # ESP32 base station firmware
│       └── base_station.ino    # LoRa receiver & data forwarder
│
├── docs/                       # Project documentation
├── docker-compose.yml          # Container orchestration
└── LICENSE
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- PostgreSQL (for Core API)
- MongoDB (for Analytics API)
- Arduino IDE (for IoT firmware)

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/estate360.git
cd estate360
```

---

### 2. Core API Setup

```bash
cd services/core-api
npm install
```

Configure the database connection in `src/app.module.ts`:

```ts
host: 'localhost',
port: 5432,
username: 'postgres',
password: '<your_password>',
database: 'estate360-test',
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

---

### 3. Analytics API Setup

```bash
cd services/analytics-api
npm install
```

Edit `.env` to configure your MongoDB connection:

```env
DATABASE_URL=mongodb://localhost:27017/estate360_analytics
DB_NAME=estate360_analytics
COORDINATES_COLLECTION=map_coordinates
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

### 5. IoT Firmware Setup

Open the firmware files in **Arduino IDE**:

- **Worker Device**: `iot/worker_device/worker_device.ino`
- **Base Station**: `iot/base_station/base_station.ino`

Required Arduino Libraries:
- `TinyGPS++`
- `Adafruit MPU6050`
- `Adafruit Unified Sensor`
- `LoRa_E32`

Set the correct `DEVICE_UUID` in `worker_device.ino` before flashing each device. Upload to the respective ESP32 boards.

---

## 👥 Team Members

> **University of Vavuniya — Faculty of Applied Science**

| Name | Student ID | Role |
|---|---|---|
| Nethsara Rahiru | 2022/ICT/62 | Assistant Developer |
| | | |
| | | |
| | | |
| | | |

---

## 📄 License

This project is licensed under the **MIT License**.
Copyright (c) 2026 Thaminu Sonal.
See the [LICENSE](./LICENSE) file for full details.