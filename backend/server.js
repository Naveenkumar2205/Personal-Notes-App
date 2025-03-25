const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default route for `/`
app.get("/", (req, res) => {
  res.send("Backend is running. Use /notes for API endpoints.");
});

// Get all notes
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) {
      console.error("Error fetching notes:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new note
app.post("/notes", (req, res) => {
  const { title, category, content } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = "INSERT INTO notes (title, category, content) VALUES (?, ?, ?)";
  const params = [title, category, content];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error adding note:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        id: this.lastID,
        title,
        category,
        content,
      });
    }
  });
});

// Update a note
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, category, content } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    UPDATE notes
    SET title = ?, category = ?, content = ?
    WHERE id = ?
  `;
  const params = [title, category, content, id];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating note:", err.message);
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Note not found." });
    } else {
      res.json({ id, title, category, content });
    }
  });
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notes WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      console.error("Error deleting note:", err.message);
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Note not found." });
    } else {
      res.json({ message: "Note deleted successfully.", id });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
