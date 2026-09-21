# Estate360 - Interactive Map Web Page (`services/analytics-api/map`)

This directory contains a 100% full-screen responsive web map application built with **Leaflet.js** and **OpenStreetMap**. It requires **no API keys** and supports both standalone exploration and embeddable overlay integration.

---

## Features

- 📍 **Interactive Marker Pinning**: Click anywhere on the map or input exact latitude/longitude coordinates to add custom pins.
- 🎨 **Modern Glassmorphism UI**: Floating translucent control toolbox overlay for adding, viewing, and clearing pin markers.
- 🖼️ **Dual View Modes (Full vs Embed Overlay)**:
  - **Full Mode**: Displays the control panel overlay for interactive pin management.
  - **Embed / Overlay Mode**: Automatically hides the control panel toolbox for seamless background/modal mapping.
- 🔄 **REST API Sync**: Pin actions (add, remove, clear) sync in real-time with the backend database API.

---

## File Structure

```
services/analytics-api/map/
├── index.html   # Main page structure loading Leaflet CDN and layout containers
├── styles.css   # Full 100vw x 100vh layout, glassmorphic panel, & embed-mode styles
├── app.js       # Leaflet map setup, click-to-pin handlers, & DB API calls
└── README.md    # This documentation file
```

---

## Usage Modes

### 1. Full Interactive View
Access the map with the control panel visible:
```
http://localhost:3000/map
```

### 2. Embed / Overlay Mode (Toolbox Hidden)
To hide the toolbox when placing the map inside an `<iframe>` or embedding it into another page:

#### Option A: URL Query Parameter
Append `?embed=true` or `?hideToolbox=true` to the URL:
```html
<iframe 
  src="http://localhost:3000/map?embed=true" 
  width="100%" 
  height="600" 
  style="border: none;">
</iframe>
```

#### Option B: Automated Iframe Detection
If the map page detects it is running inside an `<iframe>` element (`window.self !== window.top`), it will automatically hide the control panel overlay without needing extra URL parameters.

#### Option C: JavaScript Window Flag
Set `window.isOverlay = true;` before loading or execute `Estate360Map.hideToolbox()` from JavaScript.

---

## Global JavaScript API

When `app.js` loads, it attaches `window.Estate360Map` to the global scope for programmatic marker control from external parent scripts:

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `Estate360Map.addPin(lat, lng, label)` | `lat` (number), `lng` (number), `label` (string) | Adds a pin marker to map and saves to DB. |
| `Estate360Map.clearPins()` | None | Clears all pins from map and DB. |
| `Estate360Map.getPins()` | None | Returns an array of current pin objects. |
| `Estate360Map.hideToolbox()` | None | Dynamically hides the floating UI panel. |
| `Estate360Map.showToolbox()` | None | Dynamically shows the floating UI panel. |

---

## Custom Styling

All theme tokens (colors, blur intensity, shadows) are defined as CSS variables at the top of [styles.css](file:///Volumes/Backup/estate360/services/analytics-api/map/styles.css):

```css
:root {
  --bg-glass: rgba(15, 23, 42, 0.75);
  --accent-color: #38bdf8;
  --danger-color: #f43f5e;
  --radius: 12px;
}
```
