// lib/SQLiteStore.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { app } = require("electron");

class SQLiteStore {
  constructor(options = {}) {
    const name = options.name || "config";
    const userDataPath = app.getPath("userData");
    this.dbPath = path.join(userDataPath, `${name}.db`);

    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) console.error("Database open error:", err);
      else this._initTable();
    });
  }

  _initTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS store (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
  }

  async set(key, value) {
    const jsonValue = JSON.stringify(value);
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)`,
        [key, jsonValue],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async get(key, defaultValue = null) {
    return new Promise((resolve) => {
      this.db.get(
        `SELECT value FROM store WHERE key = ?`,
        [key],
        (err, row) => {
          if (err || !row) resolve(defaultValue);
          else resolve(JSON.parse(row.value));
        }
      );
    });
  }

  async delete(key) {
    // ...类似实现，省略
  }
}
module.exports = SQLiteStore;
