// import fs from 'fs';

// !fs.existsSync('db') && fs.mkdirSync('db');

// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('db/db.json');
// const db = low(adapter);
// db.defaults({
//   users: [],
// }).write();
// export default db;
import fs from 'fs';

!fs.existsSync('db') && fs.mkdirSync('db');
const files = fs.readdirSync('db');
if (!files.includes('db.json')) {
  fs.writeFileSync(
    'db/db.json',
    '{"users":[{"id":"","email":"","nickname":"","password":"","birth":""}]}',
  );
}

const db = {
  db: JSON.parse(fs.readFileSync('db/db.json', 'utf8')),
  insert: function (data) {
    this.db.users.push(data);
    const dbToJson = JSON.stringify(this.db);
    fs.writeFile('db/db.json', dbToJson, (err) => {
      if (err) {
        throw err;
      }
    });
  },
  select: function (options) {
    const index = [];
    Object.keys(this.db.users[0]).forEach((v, i) =>
      options.forEach((v2) => {
        if (v === v2) index.push(i);
      }),
    );
    const show = [];
    this.snapshot.forEach((v, i) => {
      const obj = {};
      Object.keys(this.db.users[0]).forEach((v2, i2) => {
        index.forEach((v3) => {
          if (v3 === i2) obj[v2] = Object.values(v)[v3];
        });
      });
      if (Object.keys(obj).length > 0) show.push(obj);
    });
    this.snapshot = show;
    return this;
  },
  where: function (options, data) {
    if (options.length !== data.length)
      throw Error('parameter length Different');
    const show = [];
    this.db.users.forEach((v, i) => {
      let tf = true;
      for (let i2 = 0; i2 < options.length; i2++) {
        if (v[options[i2]] !== data[i2]) {
          tf = false;
          break;
        }
      }
      if (tf) show.push(v);
    });
    this.snapshot = show;
    return this;
  },
  snapshot: [],
};
export default db;
// 사용법
// db.insert({
//   id: "c2cb1acd-155c-4037-bc3d-0bb94a3ce629",
//   email: "123@woowa.com",
//   nickname: "123",
//   password: "$2b$10$fsBt3TGHiqTplr.PRwtJQO/1glRz7QvLJ12ArOPHK.ztavaj0Qmr.",
//   birth: "1995.09.06",
// });
// console.log(db.select(["email", "id"]).snapshot);
// console.log(db.where(["email"], ["123@woowa.com"]).snapshot);
// console.log(
//   db.where(["email"], ["123@woowa.com"]).select(["email", "id"]).snapshot
// );
