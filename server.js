const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ── Serve static files IMMEDIATELY (before DB connects) ──────
// This means the HTML/CSS/JS loads right away — no waiting for MongoDB
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB Schemas ──────────────────────────────────────────
const memberSchema = new mongoose.Schema({
  memberType: { type: String, enum: ['primary','spouse','child','other'], default: 'other' },
  sortOrder:  { type: Number, default: 0 },
  name:       { type: String, required: true, trim: true },
  bloodGroup: { type: String, default: null },
  dateOfBirth:      { type: String, default: null },
  dateOfMarriage:   { type: String, default: null },
  mobileNo:         { type: String, default: null },
  alternateContact: { type: String, default: null },
  address:    { type: String, default: null, trim: true }
});

const registrationSchema = new mongoose.Schema({
  familyCardNumber: { type: String, required: true, unique: true, trim: true },
  becGroup:         { type: String, required: true, trim: true },
  members:          [memberSchema],
  ipAddress:        { type: String, default: null },
  submittedAt:      { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// ── DB connection state ──────────────────────────────────────
let dbConnected = false;

// ── API: Submit ──────────────────────────────────────────────
app.post('/api/submit', async (req, res) => {
  if (!dbConnected)
    return res.status(503).json({ error: 'Server is still starting up, please try again in a moment.' });

  try {
    const { familyCardNumber, becGroup, members } = req.body;

    if (!familyCardNumber || !becGroup || !members || !Array.isArray(members) || members.length === 0)
      return res.status(400).json({ error: 'Missing required fields.' });

    if (members.length > 10)
      return res.status(400).json({ error: 'Maximum 10 family members allowed.' });

    if (!members[0]?.name)
      return res.status(400).json({ error: 'Primary member name is required.' });

    const existing = await Registration.findOne({ familyCardNumber: familyCardNumber.trim() });
    if (existing)
      return res.status(409).json({ error: 'Family Card Registration Number already exists.' });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const reg = new Registration({
      familyCardNumber: familyCardNumber.trim(),
      becGroup: becGroup.trim(),
      ipAddress: ip,
      members: members.map((m, i) => ({
        memberType: m.memberType || (i === 0 ? 'primary' : 'other'),
        sortOrder: i,
        name: (m.name || '').trim(),
        bloodGroup: m.bloodGroup || null,
        dateOfBirth: m.dateOfBirth || null,
        dateOfMarriage: m.dateOfMarriage || null,
        mobileNo: m.mobileNo || null,
        alternateContact: m.alternateContact || null,
        address: (m.address || '').trim() || null
      }))
    });

    await reg.save();
    res.json({ success: true, registrationId: reg._id, message: 'Family registered successfully!' });

  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Family Card Registration Number already exists.' });
    console.error(err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── API: Admin ───────────────────────────────────────────────
app.get('/api/admin/registrations', async (req, res) => {
  if (!dbConnected)
    return res.status(503).json({ error: 'Database not connected yet.' });
  try {
    const regs = await Registration.find().sort({ submittedAt: -1 }).lean();
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── API: Health ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbConnected ? 'connected' : 'connecting' });
});

// ── Serve frontend ───────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start server FIRST, then connect DB ─────────────────────
// Server starts immediately — page loads right away
// MongoDB connects in background
app.listen(PORT, () => {
  console.log(`\n✝️  St. Francis Assisi Cathedral Church Directory`);
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   Connecting to MongoDB...\n`);
});

// Connect MongoDB after server is already listening
mongoose.connect(MONGO_URI)
  .then(() => {
    dbConnected = true;
    console.log('✅  MongoDB connected successfully\n');
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
