import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EmailSidebar from './EmailSidebar';
import FilterMenu from './FilterMenu';
import ProfileMenu from './ProfileMenu';
import EmailCompose from './EmailCompose';
import SummaryModal from './SummaryModal'; // Import the SummaryModal
import useStore from '../useStore'; // Import Zustand store
import EmailTable from './EmailTable'; // Import the new EmailTable component
import { Inbox, Send, Archive, PencilOff, Trash2, History, FolderX, Notebook, FileBox } from 'lucide-react'; // Import all necessary icons
import { summarizeEmail } from "../utils/summarizeEmail"; // Import summarizeEmail if defined elsewhere

const EmailList = ({ view }) => {
  const { accessToken } = useStore((state) => state); // Get accessToken from Zustand store
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeView, setActiveView] = useState('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false); // State for summary modal
  const [currentSummary, setCurrentSummary] = useState(''); // State for current summary
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch emails based on the selected folder
  const fetchEmailsByFolder = async (folderId) => {
    console.log('Folder ID: ', folderId); // Log the folder ID
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emails from the selected folder');
      }

      const data = await response.json();
      const formattedEmails = data.value.map(email => ({
        id: email.id,
        sender: {
          name: email.sender.emailAddress.name || 'Unknown Sender',
          address: email.sender.emailAddress.address || 'No Address Available',
        },
        subject: email.subject,
        preview: email.bodyPreview,
        time: new Date(email.sentDateTime).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }), // Format the date as DD MMM YEAR
        starred: false, // Default value for starred
        selected: false, // Default value for selected
      }));

      setEmails(formattedEmails);
      console.log('Fetched emails from folder:', formattedEmails);
    } catch (error) {
      console.error('Error fetching emails by folder:', error);
    }
  };

  // Fetch emails from the backend
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }), // Send accessToken in the request body
        });
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        const data = await response.json();

        // Map the response to the expected format
        const formattedEmails = data.emails.map(email => ({
          id: email.id,
          sender: {
            name: email.sender.emailAddress.name || 'Unknown Sender',
            address: email.sender.emailAddress.address || 'No Address Available',
          },
          subject: email.subject,
          preview: email.bodyPreview, // Keep the preview for display
          body: email.body.content, // Use the full body content for summarization
          time: new Date(email.sentDateTime).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }), // Format the date as DD MMM YEAR
          starred: false, // Default value for starred
          selected: false, // Default value for selected
        }));

        setEmails(formattedEmails);
        console.log('Fetched emails:', formattedEmails);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    // Initial fetch
    fetchEmails();

    // Polling every 30 seconds
    const intervalId = setInterval(() => fetchEmails(), 30000); // 30 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [accessToken]); // Add accessToken as a dependency if it can change

  // Fetch folders from the backend
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch folders: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Map the response to include icons
        const folderIcons = {
          Inbox: Inbox,
          'Sent Items': Send,
          Archive: Archive,
          'Drafts': PencilOff,
          'Deleted Items': Trash2,
          'Conversation History': History,
          'Junk Email': FolderX,
          'Notes': Notebook,
          'Outbox': FileBox
          // Add other folder names and their corresponding icons here
        };

        const formattedFolders = data.value.map(folder => ({
          id: folder.id,
          displayName: folder.displayName,
          icon: folderIcons[folder.displayName] || null,
          color: 'gray', // Default color
        }));

        setFolders(formattedFolders);
        console.log('Fetched folders:', formattedFolders);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    // Initial fetch
    fetchFolders();
  }, [accessToken]); // Add accessToken as a dependency if it can change

  // Define toggleSelectAll function
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setEmails(emails.map(email => ({ ...email, selected: newSelectAll })));
  };

  // Define toggleEmailSelection function
  const toggleEmailSelection = (emailId) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, selected: !email.selected } : email
    ));
  };

  // Define toggleStarred function
  const toggleStarred = (emailId) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  // Define handleSummary function
  const handleSummary = async (email) => {
    try {
      const summary = await summarizeEmail(email); // Call the shared summarization function
      setCurrentSummary(summary); // Set the summary state
      setIsSummaryOpen(true); // Open the summary modal
    } catch (error) {
      console.error('Error summarizing email:', error);
    }
  };

  const toggleComposeModal = () => {
    setIsComposeOpen(!isComposeOpen);
  };

  const handleFolderSelect = (folderId) => {
    // Define the function to handle folder selection
    fetchEmailsByFolder(folderId); // Example implementation
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter emails based on search query
  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-md md:hidden"
      >
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out bg-white shadow-lg rounded-r-lg `}>
        <EmailSidebar
          activeView={activeView}
          setActiveView={handleFolderSelect}
          onComposeClick={toggleComposeModal}
          folders={folders}
          onFolderSelect={handleFolderSelect}
        />
      </div>

      {/* Main content area with dynamic width */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out lg:pl-64`}>
        {/* Top Menu with Filter and Profile */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#F2F8FE] shadow-sm sm:pl-[5rem]">
          <FilterMenu />
          
          {/* Search Bar placed between FilterMenu and ProfileMenu */}
          <div className="flex-grow mx-4">
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs p-2 border border-gray-300 rounded focus:border-navy-400 focus:outline-none transition-colors"
            />
          </div>

          <ProfileMenu />
        </div>

        <div className='sm:pl-[4rem] lg:pl-[1rem]'>
          {/* Use the EmailTable component with filtered emails */}
          <EmailTable
            emails={filteredEmails} // Use filtered emails
            toggleSelectAll={toggleSelectAll}
            toggleEmailSelection={toggleEmailSelection}
            toggleStarred={toggleStarred}
            handleSummary={handleSummary}
          />
        </div>
      </div>

      {/* Render EmailCompose Modal */}
      {isComposeOpen && <EmailCompose onClose={toggleComposeModal} />}
      {/* Render SummaryModal */}
      {isSummaryOpen && <SummaryModal summary={currentSummary} onClose={() => setIsSummaryOpen(false)} />}
    </div>
  );
};

export default EmailList;