import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const COLLECTIONS = ['workshops', 'news', 'stats', 'seminars', 'leadership'];

function ensureDb() {
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const empty = Object.fromEntries(COLLECTIONS.map((c) => [c, []]));
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function nextId(collection) {
  return collection.length ? Math.max(...collection.map((i) => i.id)) + 1 : 1;
}

export function getAll(name) {
  return readDb()[name] || [];
}

export function getById(name, id) {
  return getAll(name).find((i) => i.id === Number(id));
}

export function create(name, item) {
  const db = readDb();
  const newItem = { id: nextId(db[name]), ...item, createdAt: new Date().toISOString() };
  db[name].push(newItem);
  writeDb(db);
  return newItem;
}

export function update(name, id, updates) {
  const db = readDb();
  const idx = db[name].findIndex((i) => i.id === Number(id));
  if (idx === -1) return null;
  db[name][idx] = { ...db[name][idx], ...updates, id: db[name][idx].id, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db[name][idx];
}

export function remove(name, id) {
  const db = readDb();
  const before = db[name].length;
  db[name] = db[name].filter((i) => i.id !== Number(id));
  writeDb(db);
  return db[name].length < before;
}
