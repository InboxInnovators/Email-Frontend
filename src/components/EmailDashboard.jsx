import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import EmailSidebar from './EmailSidebar';
import EmailList from './EmailList';
import EmailCompose from './EmailCompose';
import ProfileMenu from './ProfileMenu';
import FilterMenu from './FilterMenu';
import EmailView from './EmailView';
import { Search, Menu } from 'lucide-react';

const EmailDashboard = () => {
  const [activeView, setActiveView] = useState('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleComposeClick = () => {
    setIsComposeOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <EmailSidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          onComposeClick={handleComposeClick}
        />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="flex h-full flex-col">
          <div className="border-b p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <button 
                className="md:hidden mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center flex-1">
                <div className="relative flex-1 mr-4">
                  <input 
                    type="text" 
                    placeholder="Search emails" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                <FilterMenu />
              </div>
              
              <div className="ml-4">
                <ProfileMenu />
              </div>
            </div>
          </div>
          
          <Outlet />
        </div>
      </main>

      {isComposeOpen && (
        <EmailCompose onClose={() => setIsComposeOpen(false)} />
      )}
    </div>
  );
};

export default EmailDashboard; 