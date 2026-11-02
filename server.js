const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS lessons(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS lessons(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sentences(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER,
      content TEXT
    )
  `);
});

app.locals.db = db;

app.use("/api/admin", require("./routes/admin"));
app.use("/api/lessons", require("./routes/lessons"));

app.listen(3000, () => {
  console.log("http://localhost:3000");
});