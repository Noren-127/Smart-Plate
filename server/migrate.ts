import { MongoClient } from 'mongodb';
import { DISHES_DATABASE } from '../src/data/dishes';
import { YGN_INGREDIENT_PRICES } from '../src/data/ingredients';
import { DEFAULT_ACCOUNTS } from '../src/store/storage';

const client = new MongoClient(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017');
const db = (await client.connect()).db(process.env.MONGO_DB || 'nutrichef_yangon_db');
const seed = async (name: string, records: any[], key = 'id') => {
  if (!records.length) return;
  const ops = records.map(record => ({ updateOne: { filter: { _id: record[key] }, update: { $set: { ...record, _id: record[key] } }, upsert: true } }));
  await db.collection(name).bulkWrite(ops, { ordered: false });
  console.log(`${name}: ${records.length} records migrated`);
};
await seed('dishes', DISHES_DATABASE);
await seed('ingredients', YGN_INGREDIENT_PRICES);
await seed('users', DEFAULT_ACCOUNTS);
console.log(`Migration complete: ${db.databaseName}`);
await client.close();
