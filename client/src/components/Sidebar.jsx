import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Plus, Search, Sun, Moon, LogOut, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ notes, activeNoteId, setActiveNoteId, createNote, searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="w-72 h-full flex flex-col bg-[var(--bg-primary)] border-r border-[var(--border-color)] transition-colors duration-300 z-10">
      <div className="p-4 flex items-center justify-between border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full shadow-sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}
          <span className="font-semibold truncate max-w-[120px]">{user?.name}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={logout} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--accent)] transition-colors" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        {notes.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-6">No notes found.</div>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveNoteId(note._id)}
              className={`p-3 mb-1 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                activeNoteId === note._id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-secondary)]'
              }`}
            >
              <FileText size={16} className={activeNoteId === note._id ? 'text-blue-500' : 'text-gray-400'} />
              <div className="truncate flex-1">
                {note.title || 'Untitled'}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-[var(--border-color)]">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "var(--accent)" }}
          whileTap={{ scale: 0.98 }}
          onClick={createNote}
          className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] dark:bg-white dark:text-black rounded-md flex items-center justify-center gap-2 font-medium transition-colors shadow-md"
        >
          <Plus size={18} />
          New Note
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
