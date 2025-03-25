import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState({ title: "", category: "", content: "" });

  // Fetch all notes from the backend
  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Notes:", data); // Debug fetched notes
        setNotes(data);
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // Add a new note
  const handleAddNote = () => {
    if (newNote.title && newNote.category && newNote.content) {
      fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Added Note:", data); // Debug added note
          setNotes([...notes, data]);
        })
        .catch((err) => console.error("Error adding note:", err));

      setNewNote({ title: "", category: "", content: "" });
    }
  };

  // Delete a note
  const handleDeleteNote = (id) => {
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          console.log("Deleted Note ID:", id); // Debug deleted note
          setNotes(notes.filter((note) => note.id !== id));
        }
      })
      .catch((err) => console.error("Error deleting note:", err));
  };

  // Edit a note
  const handleEditNote = (id, updatedNote) => {
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Updated Note:", data); // Debug updated note
        setNotes(
          notes.map((note) => (note.id === id ? { ...note, ...data } : note))
        );
      })
      .catch((err) => console.error("Error updating note:", err));
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Personal Notes Manager</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Add Note Form */}
      <div className="add-note">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newNote.category}
          onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>
              <strong>Category:</strong> {note.category}
            </p>
            <p>{note.content}</p>
            <div className="actions">
              <button
                onClick={() =>
                  handleEditNote(note.id, {
                    title: prompt("Edit title:", note.title) || note.title,
                    category: prompt("Edit category:", note.category) || note.category,
                    content: prompt("Edit content:", note.content) || note.content,
                  })
                }
              >
                Edit
              </button>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
