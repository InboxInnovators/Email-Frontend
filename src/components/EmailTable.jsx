import React from 'react';
import { Star as StarFilled, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailTable = ({ emails, toggleSelectAll, toggleEmailSelection, toggleStarred, handleSummary, viewEmail }) => {
  const navigate = useNavigate();

  const handleItemClick = (e, email) => {
    if (e.target.closest('button')) {
      e.stopPropagation(); // Prevent the click from propagating if a button is clicked
      return;
    }
    navigate(`/email/${email.id}`, { state: { email } }); // Navigate to the email view page
  };

  
  return (
    <div>
      {/* Email List Header with Select All */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center mr-4">
          <button
            onClick={toggleSelectAll}
            className={`w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center`}
          >
            {emails.every(email => email.selected) && <Check className="w-4 h-4 text-white" />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {emails.filter(e => e.selected).length} selected
          </span>
          {emails.filter(e => e.selected).length > 0 && (
            <div className="space-x-2">
              <button className="text-sm hover:bg-blue-200 px-2 py-1 rounded border border-gray-300">
                Archive
              </button>
              <button className="text-sm hover:bg-gray-100 px-2 py-1 rounded border border-gray-300">
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
            className={`flex items-center p-3 border-b border-[#0f4f96] hover:bg-blue-100 cursor-pointer transition duration-200 ${email.selected ? 'bg-blue-100' : ''} ${email.isRead ? 'bg-white' : 'bg-gray-100'}`}
            onClick={(e) => handleItemClick(e, email)}
          >
            <input
              type="checkbox"
              checked={email.selected}
              onChange={() => toggleEmailSelection(email.id)}
              className="mr-2"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{email.sender.name}</span>
                  <span className="text-sm text-gray-600">{email.sender.address}</span>
                </div>
                <span className="text-sm text-gray-500">{email.time}</span>
              </div>
              <p className="text-gray-700 text-base">{email.subject}</p>
              <p className="text-gray-500 text-xs">{email.preview.slice(0, 50) + (email.preview.length > 50 ? '...' : '')}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the email click
                toggleStarred(email.id); // Call the toggle star function
              }}
              className={`ml-4 flex items-center space-x-2 text-sm cursor-pointer`}
            >
              <StarFilled
                className={`h-4 w-4 ${email.starred ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the email click
                handleSummary(email); // Call the summary function
              }}
              className="ml-4 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Summarize</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailTable;
