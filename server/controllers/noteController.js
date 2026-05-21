import Note from '../models/Note.js';
import Version from '../models/Version.js';

// @desc    Get all notes for a user
// @route   GET /api/notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    const note = await Note.create({
      userId: req.user._id,
      title: title || 'Untitled',
      content: content || '',
    });
    
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;
    
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Save current version before updating if it changed
    if (note.content !== content || note.title !== title) {
      await Version.create({
        noteId: note._id,
        title: note.title,
        content: note.content,
      });
    }
    
    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;
    
    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Also delete all versions for this note
    await Version.deleteMany({ noteId: req.params.id });
    
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};
