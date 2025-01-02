import { useState } from 'react';
import { format } from 'date-fns';

const EmailItem = ({ email, view }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // If the email is from today, show only the time
    if (date.toDateString() === today.toDateString()) {
      return format(date, 'h:mm a');
    }
    // If it's this year, show month and day
    if (date.getFullYear() === today.getFullYear()) {
      return format(date, 'MMM d');
    }
    // Otherwise show the full date
    return format(date, 'MM/dd/yyyy');
  };

  return (
    <div
      className={`
        flex items-center gap-4 p-4 cursor-pointer
        ${isHovered ? 'bg-gray-50' : 'bg-white'}
        ${!email.read ? 'font-semibold' : 'font-normal'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          onChange={(e) => e.stopPropagation()}
        />
      </div>

      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white uppercase">
        {email.sender.charAt(0)}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <span className="truncate">
            {view === 'sent' ? `To: ${email.recipient}` : email.sender}
          </span>
          <span className="flex-shrink-0 text-sm text-gray-500 ml-2">
            {formatDate(email.date)}
          </span>
        </div>

        <div className="text-sm">
          <span className={`${!email.read ? 'text-gray-900' : 'text-gray-600'}`}>
            {email.subject}
          </span>
          <span className="mx-2 text-gray-400">-</span>
          <span className="text-gray-500 truncate">
            {email.preview}
          </span>
        </div>
      </div>

      {isHovered && (
        <div className="flex-shrink-0 flex gap-2">
          {/* <button className="p-2 hover:bg-gray-100 rounded-full">
            <ArchiveIcon className="h-5 w-5 text-gray-500" />
          </button> */}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <TrashIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

// Simple icon components (you can replace these with your preferred icon library)
const ArchiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default EmailItem; 