import React, { useState, useEffect } from 'react';
import { Mail, Inbox, Send, Archive, Trash2, PenSquare, Folder, Menu, X } from 'lucide-react';
import Icon from '../EI-Logo.png';
import axios from 'axios'; // Import axios for API calls
import useStore from '../useStore'; // Import useStore from the correct path
import FolderModal from './FolderModal'; // Import the new FolderModal component

const EmailSidebar = ({ activeView, setActiveView, onComposeClick, folders, onFolderSelect }) => {
  const [folderName, setFolderName] = useState(''); // State for new folder name
  const [outlookFolders, setOutlookFolders] = useState([]); // State for Outlook folders
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedFolderId, setSelectedFolderId] = useState(null); // State for selected folder ID
  const [isOpen, setIsOpen] = useState(true); // State for sidebar visibility

  // Fetch folders from Outlook
  const fetchFolders = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me/mailFolders', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOutlookFolders(response.data.value); // Set the fetched folders
      console.log('Folder Details:', response.data.value);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  useEffect(() => {
    fetchFolders(); // Fetch folders when the component mounts
  }, []);

  const createFolder = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store
    try {
      const response = await axios.post('/api/createFolder', {
        accessToken,
        folderName,
      });
      alert(response.data.message);
      setFolderName(''); // Clear the folder name input
      fetchFolders(); // Refresh the folder list
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder');
    }
  };

  const renameFolder = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store
    try {
      const response = await axios.patch('/api/renameFolder', {
        accessToken,
        newFolderName: folderName,
      });
      alert(response.data.message);
      setFolderName(''); // Clear the folder name input
      fetchFolders(); // Refresh the folder list
    } catch (error) {
      console.error('Error renaming folder:', error);
      alert('Error renaming folder');
    }
  };

  const deleteFolder = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store
    try {
      const response = await axios.delete('/api/deleteFolder', {
        data: {
          accessToken,
          folderName, // Pass the folder name instead of folder ID
        },
      });
      alert(response.data.message);
      fetchFolders(); // Refresh the folder list
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Error deleting folder');
    }
  };

  return (
    <div className={`relative z-10 flex-shrink-0 bg-[#F2F8FE] h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 lg:w-20'}`}>
      {/* Mobile Menu Button - Only visible on small screens */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`h-full p-3 lg:p-4 flex flex-col border-r border-gray-200 ${isOpen ? 'block' : 'hidden'}`}>
        {/* Header */}
        <div className="flex items-center justify-center lg:justify-start mb-6">
          <div className="w-8 h-8 lg:w-12 lg:h-12">
            <img src={Icon} alt="Mail Icon" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Compose Button */}
        <button
          onClick={onComposeClick}
          className="flex items-center justify-center lg:justify-start mb-6 w-full px-3 py-2 bg-[#2186B8] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PenSquare className="w-5 h-5" />
          <span className="hidden lg:inline ml-2">Compose</span>
        </button>

        {/* Folder Functionality Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center lg:justify-start mb-6 w-full px-3 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Folder className="w-5 h-5" />
          <span className="hidden lg:inline ml-2">Folder Functions</span>
        </button>

        {/* Folder Modal */}
        <FolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          folderName={folderName}
          setFolderName={setFolderName}
          createFolder={createFolder}
          renameFolder={renameFolder}
          deleteFolder={deleteFolder}
          fetchFolders={fetchFolders}
          selectedFolderId={selectedFolderId} // Pass the selected folder ID
          setSelectedFolderId={setSelectedFolderId} // Pass the setter for selected folder ID
          outlookFolders={outlookFolders} // Pass the fetched folders to the modal
        />

        {/* Folders Section */}
        <div className="flex-grow space-y-1">
          <h3 className="font-medium mb-2">Folders</h3>
          {outlookFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => {
                setActiveView(folder.id);
                onFolderSelect(folder.id);
                setSelectedFolderId(folder.id); // Set the selected folder ID
                setFolderName(folder.displayName); // Set the folder name for deletion
              }}
              className={`flex items-center justify-start w-full p-2 rounded-lg transition-colors text-lg
                ${activeView === folder.id ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="ml-3">{folder.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailSidebar;