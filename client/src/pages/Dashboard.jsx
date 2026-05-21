import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data);
      if (res.data.length > 0 && !activeNoteId) {
        setActiveNoteId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };

  const createNote = async () => {
    try {
      const res = await axios.post('/api/notes', {
        title: 'Untitled',
        content: ''
      });
      setNotes([res.data, ...notes]);
      setActiveNoteId(res.data._id);
    } catch (error) {
      console.error('Failed to create note', error);
    }
  };

  const updateNoteInList = (updatedNote) => {
    setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note));
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      const newNotes = notes.filter(note => note._id !== id);
      setNotes(newNotes);
      if (activeNoteId === id) {
        setActiveNoteId(newNotes.length > 0 ? newNotes[0]._id : null);
      }
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden">
      <Sidebar 
        notes={filteredNotes} 
        activeNoteId={activeNoteId} 
        setActiveNoteId={setActiveNoteId} 
        createNote={createNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="flex-1 overflow-hidden relative">
        {activeNoteId ? (
          <NoteEditor 
            activeNoteId={activeNoteId} 
            updateNoteInList={updateNoteInList}
            deleteNote={deleteNote}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <svg className="w-24 h-24 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl font-medium">Select a note or create a new one</p>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
