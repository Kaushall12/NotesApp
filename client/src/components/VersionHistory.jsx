import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { X, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const VersionHistory = ({ noteId, onClose, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/versions/${noteId}`);
      setVersions(res.data);
    } catch (error) {
      console.error('Failed to fetch versions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [noteId]);

  const handleRestore = async (versionId) => {
    try {
      const res = await axios.post('/api/versions/restore', {
        noteId,
        versionId
      });
      onRestore(res.data);
    } catch (error) {
      console.error('Failed to restore version', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)]">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <button 
            onClick={fetchVersions} 
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors flex items-center justify-center"
            title="Refresh versions"
          >
            <RotateCcw size={18} className={`text-blue-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          Version History
        </h3>
        <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <p>No previous versions found.</p>
            <p className="text-sm mt-2 opacity-70">Versions are created automatically when you update a note.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={version._id} 
                className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedVersion === version._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-gray-400 shadow-sm'}`}
                onClick={() => setSelectedVersion(version._id === selectedVersion ? null : version._id)}
              >
                <div className="font-medium text-[var(--text-primary)] mb-1">
                  {format(new Date(version.createdAt), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mb-2">
                  {format(new Date(version.createdAt), 'h:mm:ss a')}
                </div>
                
                {selectedVersion === version._id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-[var(--border-color)]"
                  >
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preview</div>
                    <div className="text-sm line-clamp-3 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                      {version.title && <div className="font-medium mb-1 truncate">{version.title}</div>}
                      {version.content || <em className="text-gray-400">Empty content</em>}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version._id);
                      }}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={14} />
                      Restore this version
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
