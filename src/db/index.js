import fs from 'fs';

!fs.existsSync('db') && fs.mkdirSync('db');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/db.json');
const db = low(adapter);
db.defaults({
  users: [],
}).write();
export default db;
