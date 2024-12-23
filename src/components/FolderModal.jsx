import React, { useState } from 'react';
import useStore from '../useStore'; // Adjust the import path as necessary
import { toast } from 'sonner'; // Import the toast function from sonner

const FolderModal = ({ isOpen, onClose, fetchFolders, selectedFolderId, outlookFolders }) => {
  const [folderName, setFolderName] = useState(''); // State for new folder name

  const createFolder = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store

    // Validation checks
    if (!accessToken) {
      toast.error('Access token is required.'); // Use Sonner toaster for error
      return;
    }
    if (!folderName) {
      toast.error('Folder name is required.'); // Use Sonner toaster for error
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/createFolder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          accessToken, 
          folderName // Only pass accessToken and folderName
        }),
      });

      const data = await response.json();
      toast.success(data.message); // Use Sonner toaster for success
      setFolderName(''); // Clear the folder name input
      fetchFolders(); // Refresh the folder list
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Error creating folder'); // Use Sonner toaster for error
    }
  };

  const renameFolder = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store
    try {
      const response = await fetch('http://localhost:5000/api/renameFolder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          accessToken, // Send accessToken in the body
          newFolderName: folderName // Use folderName directly
        }),
      });

      const data = await response.json();
      toast.success(data.message); // Use Sonner toaster for success
      setFolderName(''); // Clear the folder name input
      fetchFolders(); // Refresh the folder list
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Error renaming folder'); // Use Sonner toaster for error
    }
  };

  const deleteFolder = async () => {
    const accessToken = useStore.getState().accessToken; // Get access token from Zustand store

    // Validation checks
    if (!accessToken) {
      toast.error('Access token is required.'); // Use Sonner toaster for error
      return;
    }
    if (!folderName) {
      toast.error('Folder name is required.'); // Use Sonner toaster for error
      return;
    }
    console.log('Folder Name: ',folderName);
    console.log('Access Token: ',accessToken);

    try {
      const response = await fetch('http://localhost:5000/api/deleteFolder', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          accessToken, // Send accessToken in the body
          folderName // Use folderName for deletion
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message); // Use Sonner toaster for success
        fetchFolders(); // Refresh the folder list
      } else {
        toast.error(data.message || 'Error deleting folder'); // Use Sonner toaster for error
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Error deleting folder'); // Use Sonner toaster for error
    }
  };

  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">Folder Functionalities</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          />
          <div className="flex space-x-2">
            <button onClick={createFolder} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Folder</button>
            <button onClick={renameFolder} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Rename Folder</button>
            <button onClick={deleteFolder} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Folder</button>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 bg-gray-300 text-black px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default FolderModal; 