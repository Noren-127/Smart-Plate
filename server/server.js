import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const port = Number(process.env.PORT || 3001);
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGO_DB || 'nutrichef_yangon_db';
const client = new MongoClient(mongoUri);
let db;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: Boolean(db), database: dbName }));
app.get('/api/users', async (_req, res) => { try { res.json(await db.collection('users').find({}).project({ password: 0 }).toArray()); } catch (error) { res.status(500).json({ error: error.message }); } });
app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const account = await db.collection('users').findOne({ email, password });
    if (!account) return res.status(401).json({ error: 'Invalid credentials' });
    const { password: _password, ...safeAccount } = account;
    res.json(safeAccount);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.post('/api/users', async (req, res) => {
  try { await db.collection('users').replaceOne({ _id: req.body.id }, { ...req.body, _id: req.body.id, updatedAt: new Date() }, { upsert: true }); res.status(201).json({ ok: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});
app.patch('/api/users/:id/profile', async (req, res) => {
  try {
    await db.collection('users').updateOne({ _id: req.params.id }, { $set: { profile: req.body, name: req.body.name, updatedAt: new Date() } });
    res.json({ ok: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.get('/api/meal-plans', async (_req, res) => {
  try { res.json(await db.collection('meal_plans').find({}).sort({ updatedAt: -1 }).toArray()); }
  catch (error) { res.status(500).json({ error: error.message }); }
});
app.get('/api/meal-plans/:customerId', async (req, res) => {
  try {
    const plans = await db.collection('meal_plans').find({ customerId: req.params.customerId }).sort({ createdAt: -1 }).toArray();
    res.json(plans);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.post('/api/meal-plans', async (req, res) => {
  try {
    const plan = { ...req.body, _id: req.body.id, updatedAt: new Date() };
    await db.collection('meal_plans').replaceOne({ _id: plan._id }, plan, { upsert: true });
    res.status(201).json({ ok: true, id: plan._id });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.get('/api/chef-programs', async (_req, res) => {
  try { res.json(await db.collection('chef_programs').find({}).sort({ updatedAt: -1 }).toArray()); }
  catch (error) { res.status(500).json({ error: error.message }); }
});
app.post('/api/chef-programs', async (req, res) => {
  try {
    const program = { ...req.body, _id: req.body.id, updatedAt: new Date() };
    await db.collection('chef_programs').replaceOne({ _id: program._id }, program, { upsert: true });
    res.status(201).json({ ok: true, id: program.id });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.post('/api/orders', async (req, res) => {
  try { await db.collection('orders').replaceOne({ _id: req.body.id }, { ...req.body, _id: req.body.id, updatedAt: new Date() }, { upsert: true }); res.status(201).json({ ok: true }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

client.connect().then(() => { db = client.db(dbName); app.listen(port, () => console.log(`SmartPlate API connected to ${mongoUri}/${dbName} on port ${port}`)); })
  .catch(error => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
