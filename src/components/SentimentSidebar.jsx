import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SentimentSidebar = ({ sentiment, isOpen, setIsOpen, isSentimentLoading }) => {
  const getBadgeClasses = (value) => {
    switch (value?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      case 'neutral':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  // Set the sidebar to be open by default
  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    < div >
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar on the left side */}
      <div className={`fixed top-25 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-80`}>
        {/* Toggle Button */}
        <button
          className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-r-lg shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Email Analysis Results
          </h2>
          
          <div className="space-y-4">
            {isSentimentLoading ? (
              <div className="text-center">
                <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              sentiment ? (
                sentiment.split('\n').map((line, index) => {
                  if (!line.trim()) return null;
                  const [key, value] = line.split(':').map(item => item.trim());
                  return (
                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {key}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getBadgeClasses(value)}`}>
                        {value}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">
                  No sentiment analysis available.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentSidebar;