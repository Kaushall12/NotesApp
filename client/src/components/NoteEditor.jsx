import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { History, Trash2, Clock, CheckCircle } from 'lucide-react';
import VersionHistory from './VersionHistory';
import { motion, AnimatePresence } from 'framer-motion';

const NoteEditor = ({ activeNoteId, updateNoteInList, deleteNote }) => {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!activeNoteId) return;
      try {
        const res = await axios.get('/api/notes');
        const currentNote = res.data.find(n => n._id === activeNoteId);
        if (currentNote) {
          setNote(currentNote);
          setTitle(currentNote.title);
          setContent(currentNote.content);
        }
      } catch (error) {
        console.error('Failed to fetch note', error);
      }
    };
    
    fetchNote();
    setShowVersions(false);
  }, [activeNoteId]);

  const saveNote = async () => {
    if (!activeNoteId) return;
    setIsSaving(true);
    try {
      const res = await axios.put(`/api/notes/${activeNoteId}`, {
        title,
        content
      });
      setNote(res.data);
      updateNoteInList(res.data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (note && (title !== note.title || content !== note.content)) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveNote();
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, content]);

  if (!note) return null;

  return (
    <div className="h-full flex relative bg-[var(--bg-primary)]">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showVersions ? 'mr-80' : ''}`}>
        <div className="h-14 flex items-center justify-between px-8 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isSaving ? (
              <span className="flex items-center gap-1"><Clock size={14} className="animate-spin" /> Saving...</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1"><CheckCircle size={14} /> Saved at {format(lastSaved, 'h:mm a')}</span>
            ) : (
              <span>Last edited {format(new Date(note.updatedAt), 'MMM d, h:mm a')}</span>
            )}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowVersions(!showVersions)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showVersions ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
            >
              <History size={16} />
              Versions
            </button>
            <button 
              onClick={() => deleteNote(activeNoteId)}
              className="flex items-center gap-2 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10 max-w-4xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full text-4xl font-bold bg-transparent outline-none mb-8 text-[var(--text-primary)] placeholder-gray-300 dark:placeholder-gray-700"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing..."
              className="w-full h-[60vh] text-lg bg-transparent outline-none resize-none text-[var(--text-secondary)] placeholder-gray-400 leading-relaxed custom-scrollbar"
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showVersions && (
          <motion.div 
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] absolute right-0 top-0 bottom-0 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20"
          >
            <VersionHistory 
              noteId={activeNoteId} 
              onClose={() => setShowVersions(false)}
              onRestore={(restoredNote) => {
                setNote(restoredNote);
                setTitle(restoredNote.title);
                setContent(restoredNote.content);
                updateNoteInList(restoredNote);
                setShowVersions(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteEditor;
