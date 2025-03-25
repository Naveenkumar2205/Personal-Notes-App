const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create or connect to the SQLite database
const db = new sqlite3.Database(path.join(__dirname, "notes.db"), (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the "notes" table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Notes table is ready.");
      }
    }
  );
});

module.exports = db;
