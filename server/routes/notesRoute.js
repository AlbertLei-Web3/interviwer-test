const express = require("express");
const router = express.Router();

// 使用内存数据结构存储笔记 use memory data structure to store notes
let notes = [];
let nextId = 1;

// POST /notes - 创建新笔记 create new note
router.post("/", (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    console.log('Invalid note data:', req.body);
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newNote = {
    id: nextId++, 
    title,
    content,
    createdAt: new Date()
  };
  
  notes.push(newNote);
  console.log('Note created:', newNote);
  res.status(201).json(newNote);
});

// GET /notes - 获取所有笔记 get all notes
router.get("/", (req, res) => {
  console.log('Fetching all notes. Count:', notes.length);
  res.json(notes);
});

// GET /notes/:id - 获取特定笔记 get specific note by id
router.get("/:id", (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  

  if (!note) {
    console.log('Note not found:', req.params.id);
    return res.status(404).json({ error: "Note not found" });
  }
  
  console.log('Fetching note:', note);
  res.json(note);
});

// PUT /notes/:id - 更新笔记 update note
router.put("/:id", (req, res) => {
  const { title, content } = req.body;
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
  

  if (noteIndex === -1) {
    console.log('Note not found for update:', req.params.id);
    return res.status(404).json({ error: "Note not found" });
  }
  
  if (!title || !content) {
    console.log('Invalid update data:', req.body);
    return res.status(400).json({ error: "Title and content are required" });
  }
  
  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    content,
    updatedAt: new Date()
  };
  
  console.log('Note updated:', notes[noteIndex]);
  res.json(notes[noteIndex]);
});

// DELETE /notes/:id - 删除笔记
router.delete("/:id", (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
  
  if (noteIndex === -1) {
    console.log('Note not found for deletion:', req.params.id);
    return res.status(404).json({ error: "Note not found" });
  }
  
  const deletedNote = notes.splice(noteIndex, 1)[0];
  console.log('Note deleted:', deletedNote);
  res.json({ message: "Note deleted successfully", note: deletedNote });
});

module.exports = router; 