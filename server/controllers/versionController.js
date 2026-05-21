import Version from '../models/Version.js';
import Note from '../models/Note.js';

// @desc    Get all versions of a note
// @route   GET /api/versions/:noteId
export const getVersions = async (req, res, next) => {
  try {
    // First verify user owns the note
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    const versions = await Version.find({ noteId: req.params.noteId }).sort({ createdAt: -1 });
    res.status(200).json(versions);
  } catch (error) {
    next(error);
  }
};

// @desc    Restore a version
// @route   POST /api/versions/restore
export const restoreVersion = async (req, res, next) => {
  try {
    const { noteId, versionId } = req.body;

    // Verify user owns the note
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    const version = await Version.findById(versionId);
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    // Save current state as a version before restoring
    await Version.create({
      noteId: note._id,
      title: note.title,
      content: note.content,
    });

    // Update note with old version data
    note.title = version.title;
    note.content = version.content;
    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
