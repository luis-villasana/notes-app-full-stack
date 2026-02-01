/*
continue in chatgpt in 'Simple React Native App'

*/


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'LuisVillasana',        // your Postgres username
  host: 'localhost',
  database: 'notes_app', // your database
  password: 'mypassword',// your password
  port: 5432
});

// Get all notes
app.get('/notes', async (req, res) => {
  const notes = await pool.query('SELECT * FROM notes ORDER BY id DESC');
  res.json(notes.rows);
});

// Add a note
app.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  const newNote = await pool.query(
    'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
    [title, content]
  );
  res.json(newNote.rows[0]);
});

// Update a note
app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updated = await pool.query(
    'UPDATE notes SET title=$1, content=$2 WHERE id=$3 RETURNING *',
    [title, content, id]
  );
  res.json(updated.rows[0]);
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM notes WHERE id=$1', [id]);
  res.json({ message: 'Note deleted' });
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));
