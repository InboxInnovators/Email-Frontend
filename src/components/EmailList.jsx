import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Check, Inbox, Send, Archive ,PencilOff,Trash2, History, FolderX, Notebook, FileBox} from 'lucide-react';
import EmailSidebar from './EmailSidebar';
import FilterMenu from './FilterMenu';
import ProfileMenu from './ProfileMenu';
import EmailCompose from './EmailCompose';
import useStore from '../useStore'; // Import Zustand store

const EmailList = ({ view }) => {
  const { accessToken } = useStore((state) => state); // Get accessToken from Zustand store

  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeView, setActiveView] = useState('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Fetch emails from the backend
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/emails', {
          method: 'POST', // Assuming your backend expects a POST request
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
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
          preview: email.bodyPreview,
          time: new Date(email.sentDateTime).toLocaleString(), // Format the date as needed
          starred: false, // Default value for starred
          selected: false, // Default value for selected
        }));

        setEmails(formattedEmails);
        console.log('Fetched emails:', formattedEmails);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    if (accessToken) { // Ensure accessToken is available before fetching emails
      fetchEmails();
    }
  }, [accessToken]); // Dependency on accessToken

  // Fetch folders from the backend
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/folders', {
          method: 'POST', // Assuming your backend expects a POST request
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
          body: JSON.stringify({ accessToken }), // Send accessToken in the request body
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
          'Drafts':PencilOff,
          'Deleted Items':Trash2,
          'Conversation History':History,
          'Junk Email':FolderX,
          'Notes':Notebook,
          'Outbox':FileBox
          // Add other folder names and their corresponding icons here
        };

        const formattedFolders = data.value.map(folder => ({
          displayName: folder.displayName,
          icon: folderIcons[folder.displayName] || null, // Assign icon based on folder name
          color: '#0F4F97', // Default color or customize as needed
        }));

        setFolders(formattedFolders);
      } catch (error) {
        console.error('Error fetching folders:', error.message || error);
      }
    };

    if (accessToken) { // Ensure accessToken is available before fetching folders
      fetchFolders();
    }
  }, [accessToken]); // Dependency on accessToken

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setEmails(emails.map(email => ({ ...email, selected: newSelectAll })));
  };

  const toggleEmailSelection = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, selected: !email.selected } : email
    ));
    setSelectAll(emails.every(email => email.selected));
  };

  const toggleStarred = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleItemClick = (e, email) => {
    if (e.target.closest('button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/email/${email.id}`, { state: { email } });
  };

  const toggleComposeModal = () => {
    setIsComposeOpen(!isComposeOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out`}>
        <EmailSidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          onComposeClick={toggleComposeModal}
          folders={folders}
        />
      </div>

      {/* Main content area with dynamic width */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-64' : 'pl-16'}`}>
        {/* Top Menu with Filter and Profile */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <FilterMenu />
          <ProfileMenu />
        </div>

        {/* Email List Header with Select All */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex items-center mr-4">
            <button 
              onClick={toggleSelectAll}
              className={`w-5 h-5 border-2 border-black flex items-center justify-center ${selectAll ? 'bg-black' : 'bg-white'}`}
            >
              {selectAll && <Check className="w-4 h-4 text-white" />}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {emails.filter(e => e.selected).length} selected
            </span>
            {emails.filter(e => e.selected).length > 0 && (
              <div className="space-x-2">
                <button className="text-sm hover:bg-gray-100 px-2 py-1 rounded">
                  Archive
                </button>
                <button className="text-sm hover:bg-gray-100 px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email List Items */}
        <div>
          {emails.map((email) => (
            <div 
              key={email.id} 
              className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${email.selected ? 'bg-gray-100' : ''}`}
              onClick={(e) => handleItemClick(e, email)}
            >
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{email.sender.name} ({email.sender.address})</h3>
                  <span className="text-sm text-gray-500">{email.time}</span>
                </div>
                <p className="text-gray-700 text-base">{email.subject}</p>
                <p className="text-gray-500 text-xs">{email.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render EmailCompose Modal */}
      {isComposeOpen && <EmailCompose onClose={toggleComposeModal} />}
    </div>
  );
};

export default EmailList; 