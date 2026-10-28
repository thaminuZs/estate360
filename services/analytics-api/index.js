import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load database environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// DB Configuration from .env
const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/estate360_analytics';
const dbName = process.env.DB_NAME || 'estate360_analytics';
const collectionName = process.env.COORDINATES_COLLECTION || 'map_coordinates';

let db;
let coordinatesCollection;

// Connect to MongoDB and ensure database and collection exist
async function initDb() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log(`[MongoDB] Connected successfully to ${mongoUri}`);
    db = client.db(dbName);
    coordinatesCollection = db.collection(collectionName);

    // Insert initial seed coordinate if collection is empty (this creates database & collection in MongoDB Compass)
    const count = await coordinatesCollection.countDocuments();
    if (count === 0) {
      await coordinatesCollection.insertOne({
        label: 'Colombo HQ',
        lat: 6.9271,
        lng: 79.8612,
        createdAt: new Date()
      });
      console.log(`[MongoDB] Database "${dbName}" and collection "${collectionName}" created with initial pin!`);
    }
  } catch (err) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${err.message}. Falling back to in-memory mode.`);
  }
}

// In-Memory fallback store if MongoDB is not running
let inMemoryDb = [
  { id: '1', lat: 6.9271, lng: 79.8612, label: 'Colombo HQ' }
];

// Serve static map files
app.use('/map', express.static(path.join(__dirname, 'map')));

app.get('/', (req, res) => {
  res.redirect('/map');
});

// --- REST API ENDPOINTS FOR COORDINATES ---

// GET /api/coordinates - Fetch all saved pins
app.get('/api/coordinates', async (req, res) => {
  if (coordinatesCollection) {
    try {
      const items = await coordinatesCollection.find({}).toArray();
      const formatted = items.map((item) => ({
        id: item._id.toString(),
        lat: item.lat,
        lng: item.lng,
        label: item.label
      }));
      return res.json(formatted);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json(inMemoryDb);
});

// POST /api/coordinates - Create/Save new pin
app.post('/api/coordinates', async (req, res) => {
  const { lat, lng, label } = req.body;
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'lat and lng coordinates are required' });
  }

  const newPinData = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    label: label || `Pin (${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)})`,
    createdAt: new Date()
  };

  if (coordinatesCollection) {
    try {
      const result = await coordinatesCollection.insertOne(newPinData);
      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newPinData
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // In-Memory Fallback
  const fallbackPin = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    ...newPinData
  };
  inMemoryDb.push(fallbackPin);
  res.status(201).json(fallbackPin);
});

// PUT /api/coordinates/:id - Update existing pin
app.put('/api/coordinates/:id', async (req, res) => {
  const { id } = req.params;
  const { lat, lng, label } = req.body;

  const updateFields = {};
  if (lat !== undefined) updateFields.lat = parseFloat(lat);
  if (lng !== undefined) updateFields.lng = parseFloat(lng);
  if (label !== undefined) updateFields.label = label;

  if (coordinatesCollection) {
    try {
      let query;
      try { query = { _id: new ObjectId(id) }; } catch (e) { query = { _id: id }; }
      await coordinatesCollection.updateOne(query, { $set: updateFields });
      return res.json({ id, ...updateFields });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  const pinIndex = inMemoryDb.findIndex((p) => p.id === id);
  if (pinIndex !== -1) {
    Object.assign(inMemoryDb[pinIndex], updateFields);
    return res.json(inMemoryDb[pinIndex]);
  }
  res.status(404).json({ error: 'Pin not found' });
});

// DELETE /api/coordinates/:id - Delete single pin
app.delete('/api/coordinates/:id', async (req, res) => {
  const { id } = req.params;

  if (coordinatesCollection) {
    try {
      let query;
      try { query = { _id: new ObjectId(id) }; } catch (e) { query = { _id: id }; }
      await coordinatesCollection.deleteOne(query);
      return res.json({ success: true, deletedId: id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  inMemoryDb = inMemoryDb.filter((p) => p.id !== id);
  res.json({ success: true, deletedId: id });
});

// DELETE /api/coordinates - Clear all pins
app.delete('/api/coordinates', async (req, res) => {
  if (coordinatesCollection) {
    try {
      await coordinatesCollection.deleteMany({});
      return res.json({ success: true, message: 'All coordinates cleared' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  inMemoryDb = [];
  res.json({ success: true, message: 'All coordinates cleared' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'analytics-api',
    dbUrl: mongoUri,
    mongoConnected: !!coordinatesCollection
  });
});

// Initialize DB and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Analytics API running on http://localhost:${PORT}`);
    console.log(`Map View: http://localhost:${PORT}/map`);
    console.log(`Map Overlay View: http://localhost:${PORT}/map?embed=true`);
  });
});
