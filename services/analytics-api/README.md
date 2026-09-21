# Estate360 - Analytics API Service

The **Analytics API** service provides backend API endpoints and interactive web map visualization capabilities for the Estate360 platform.

## Features

- 🗺️ **Interactive OpenStreetMap Visualization**: 100% free full-screen map engine powered by Leaflet.js with zero API key dependencies.
- 🖼️ **Embeddable Overlay Support**: Easily embed map views inside parent websites or modals with automatic toolbox suppression.
- 📌 **Coordinate Pinning & Management**: Full CRUD REST API for saving, updating, fetching, and removing geospatial coordinate pins.
- ⚙️ **Environment Configurable**: Configurable database connection settings loaded dynamically via `.env`.

---

## Directory Architecture

```
services/analytics-api/
├── .env                  # Environment database configuration
├── .env.example          # Template environment file
├── index.js              # Express API server & static server entry point
├── package.json          # Node.js dependencies & npm scripts
└── map/                  # Full-screen frontend map application
    ├── index.html        # Main HTML layout
    ├── styles.css        # 100% viewport CSS & Glassmorphism styles
    ├── app.js            # Leaflet map logic & DB API integration
    └── README.md         # Dedicated Map UI documentation
```

---

## Getting Started

### 1. Prerequisites
Ensure Node.js (v18+) and npm are installed on your machine.

### 2. Environment Setup
Copy `.env.example` to `.env` and set your target database connection details:

```bash
cp .env.example .env
```

Default `.env` contents:
```env
DATABASE_URL=mongodb://localhost:27017/estate360_analytics
DB_NAME=estate360_analytics
COORDINATES_COLLECTION=map_coordinates
```

### 3. Installation
Install project dependencies:
```bash
npm install
```

### 4. Running the Server
Start the Express server:
```bash
npm start
```

The service will run at `http://localhost:3000`.

---

## REST API Documentation

### Coordinates Endpoints

#### 1. Fetch All Coordinates
- **Method**: `GET`
- **Path**: `/api/coordinates`
- **Response**: `200 OK`
```json
[
  {
    "id": "1",
    "lat": 6.9271,
    "lng": 79.8612,
    "label": "Colombo HQ"
  }
]
```

#### 2. Create / Save New Coordinate
- **Method**: `POST`
- **Path**: `/api/coordinates`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "lat": 7.2906,
  "lng": 80.6337,
  "label": "Kandy Office"
}
```
- **Response**: `201 Created`

#### 3. Update Existing Coordinate
- **Method**: `PUT`
- **Path**: `/api/coordinates/:id`
- **Body**:
```json
{
  "label": "Updated Location Name"
}
```
- **Response**: `200 OK`

#### 4. Delete Single Coordinate
- **Method**: `DELETE`
- **Path**: `/api/coordinates/:id`
- **Response**: `200 OK`

#### 5. Clear All Coordinates
- **Method**: `DELETE`
- **Path**: `/api/coordinates`
- **Response**: `200 OK`

---

## Service Endpoints

| Route | Description |
| :--- | :--- |
| `GET /` | Redirects automatically to `/map` |
| `GET /map` | Interactive full-screen map with control panel |
| `GET /map?embed=true` | Embed/Overlay mode (control toolbox hidden) |
| `GET /api/health` | Service status check |
