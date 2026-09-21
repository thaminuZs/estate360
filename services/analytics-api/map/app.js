// State Management
const pins = [];
let map;

// Check if running inside iframe or embed URL mode
function checkEmbedMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const isEmbedQuery = urlParams.get('embed') === 'true' || urlParams.get('hideToolbox') === 'true';
  const isIframe = window.self !== window.top;

  if (isEmbedQuery || isIframe || window.isOverlay) {
    document.body.classList.add('embed-mode');
  }
}

// Initialize Map
async function initMap() {
  checkEmbedMode();

  // Default coordinates (Centered at Colombo, Sri Lanka / customizable)
  const defaultLat = 6.9271;
  const defaultLng = 79.8612;
  const defaultZoom = 12;

  map = L.map('map', {
    zoomControl: true,
    attributionControl: true
  }).setView([defaultLat, defaultLng], defaultZoom);

  // 100% Free OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Listen to map click event to place pins interactively (if not in read-only overlay mode)
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    const label = prompt('Enter a label for this location:', `Pin #${pins.length + 1}`);
    if (label !== null) {
      await saveAndAddPin(lat, lng, label.trim() || `Pin #${pins.length + 1}`);
    }
  });

  // Attach UI Form Event Handlers
  setupFormHandlers();

  // Load initial coordinates from backend database location
  await fetchCoordinatesFromDB();
}

// Fetch Pins from DB API
async function fetchCoordinatesFromDB() {
  try {
    const res = await fetch('/api/coordinates');
    if (!res.ok) throw new Error('Failed to fetch from DB');
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((item) => {
        addPinToMap(item.lat, item.lng, item.label, item.id || item._id);
      });
    }
  } catch (err) {
    console.warn('Could not fetch pins from database, running in local mode:', err.message);
  }
}

// Save Pin to DB API and Add to Map
async function saveAndAddPin(lat, lng, label) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    alert('Invalid coordinates provided.');
    return;
  }

  let dbId = Date.now() + Math.random().toString(36).substring(2, 9);

  try {
    const res = await fetch('/api/coordinates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: latitude, lng: longitude, label })
    });
    if (res.ok) {
      const saved = await res.json();
      if (saved.id || saved._id) dbId = saved.id || saved._id;
    }
  } catch (err) {
    console.warn('Error saving pin to database, using local storage fallback:', err.message);
  }

  addPinToMap(latitude, longitude, label, dbId);
}

// Render Pin on Leaflet Map
function addPinToMap(latitude, longitude, label, id) {
  // Prevent duplicate pins
  if (pins.some((p) => p.id === id)) return;

  const marker = L.marker([latitude, longitude]).addTo(map);
  const title = label || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

  marker.bindPopup(`
    <div style="font-family: system-ui;">
      <strong style="font-size: 14px; color: #38bdf8;">${title}</strong><br/>
      <span style="font-size: 12px; color: #cbd5e1;">Lat: ${latitude.toFixed(6)}</span><br/>
      <span style="font-size: 12px; color: #cbd5e1;">Lng: ${longitude.toFixed(6)}</span>
    </div>
  `);

  const pinObj = {
    id,
    lat: latitude,
    lng: longitude,
    label: title,
    marker
  };

  pins.push(pinObj);
  map.panTo([latitude, longitude]);
  renderPinsList();
}

// Remove Pin from Map & DB
async function removePin(id) {
  const index = pins.findIndex((p) => p.id === id);
  if (index !== -1) {
    map.removeLayer(pins[index].marker);
    pins.splice(index, 1);
    renderPinsList();

    try {
      await fetch(`/api/coordinates/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete pin from database:', err.message);
    }
  }
}

// Clear all pins
async function clearPins() {
  pins.forEach((p) => map.removeLayer(p.marker));
  pins.length = 0;
  renderPinsList();

  try {
    await fetch('/api/coordinates', { method: 'DELETE' });
  } catch (err) {
    console.warn('Failed to clear database pins:', err.message);
  }
}

// Render Pins Sidebar List
function renderPinsList() {
  const pinsListEl = document.getElementById('pins-list');
  if (!pinsListEl) return;

  pinsListEl.innerHTML = '';

  if (pins.length === 0) {
    pinsListEl.innerHTML = '<li class="empty-msg">No pins added yet. Click anywhere on the map or enter coordinates above!</li>';
    return;
  }

  pins.forEach((pin) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="pin-info">
        <span class="pin-title">${pin.label}</span>
        <span class="pin-coords">${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}</span>
      </div>
      <button class="delete-btn" title="Remove Pin">✕</button>
    `;

    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return;
      map.setView([pin.lat, pin.lng], 15);
      pin.marker.openPopup();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      removePin(pin.id);
    });

    pinsListEl.appendChild(li);
  });
}

// Setup Event Handlers
function setupFormHandlers() {
  const form = document.getElementById('pin-form');
  const clearBtn = document.getElementById('clear-pins-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const latInput = document.getElementById('lat-input');
      const lngInput = document.getElementById('lng-input');
      const labelInput = document.getElementById('label-input');

      await saveAndAddPin(latInput.value, lngInput.value, labelInput.value);

      latInput.value = '';
      lngInput.value = '';
      labelInput.value = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (pins.length > 0 && confirm('Are you sure you want to remove all pins?')) {
        clearPins();
      }
    });
  }
}

// Global reference for programmatic control when embedded as overlay
window.Estate360Map = {
  addPin: (lat, lng, label) => saveAndAddPin(lat, lng, label),
  clearPins,
  hideToolbox: () => document.body.classList.add('embed-mode'),
  showToolbox: () => document.body.classList.remove('embed-mode'),
  getPins: () => pins.map(({ id, lat, lng, label }) => ({ id, lat, lng, label }))
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initMap);
