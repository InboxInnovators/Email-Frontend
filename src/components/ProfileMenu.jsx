import { useState } from 'react';
import { UserCircle } from 'lucide-react';

const ProfileMenu = ({ userName, userEmail, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          className="w-8 h-8 rounded-full"
          src="https://ui-avatars.com/api/?name=John+Doe"
          alt="User profile"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
          <div className="px-4 py-3 border-b">
            <span className="block text-sm font-medium text-gray-900">{userName}</span>
            <span className="block text-sm text-gray-500">{userEmail}</span>
          </div>
          <ul>
            <li>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
            </li>
            <li>
              <button onClick={onSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 