import { useState } from 'react';
import { 
  Mail, 
  Inbox, 
  Send, 
  Archive, 
  Trash2,
  Menu,
  PenSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../EI-Logo.png';

const EmailSidebar = ({ activeView, setActiveView, onComposeClick, folders }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-400 ease-in-out flex-shrink-0 bg-white h-full`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      initial={{ width: 256 }}
    >
      <div className="h-full p-4 flex flex-col border-r border-gray-200">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <img src={Icon} alt="Mail Icon" className="w-[85px] h-[80px] mr-3" /> 
                  <motion.h1
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                  </motion.h1>
                </>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} />
          </motion.button>
        </div>

        {/* Compose Button */}
        <motion.button
          onClick={onComposeClick}
          className="flex items-center mb-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PenSquare className="w-5 h-5" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="ml-2"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Compose
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Navigation Items */}
        <nav className="flex-grow">
          {folders.map((folder) => (
            <motion.button
              key={folder.displayName}
              onClick={() => setActiveView(folder.displayName)}
              className={`flex items-center w-full p-2 rounded-lg transition-colors mb-2 ${
                activeView === folder.displayName ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {folder.icon && (
                <folder.icon 
                  className="w-5 h-5" 
                  style={{ color: activeView === folder.displayName ? 'white' : folder.color }}
                />
              )}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-3 capitalize"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {folder.displayName}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default EmailSidebar; 