import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AlertCircle, ThumbsUp, BookOpen, Zap, RefreshCcw, User } from 'lucide-react';

const SentimentAnalysisAccordion = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true);

  const defaultData = {
    Urgency: 'Low',
    Sentiment: 'Neutral',
    Category: 'Security Notification',
    Impact: 'Low',
    'Recurrence/Escalation': 'No',
    'Sender Profile': 'Other'
  };

  const analysisData = data || defaultData;

  const getBadgeClasses = (value) => {
    const normalizedValue = value.toLowerCase();
    
    switch (normalizedValue) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medium':
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
      case 'yes':
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'negative':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    }
  };

  const getIcon = (key) => {
    switch (key) {
      case 'Urgency':
        return <AlertCircle className="w-4 h-4" />;
      case 'Sentiment':
        return <ThumbsUp className="w-4 h-4" />;
      case 'Category':
        return <BookOpen className="w-4 h-4" />;
      case 'Impact':
        return <Zap className="w-4 h-4" />;
      case 'Recurrence/Escalation':
        return <RefreshCcw className="w-4 h-4" />;
      case 'Sender Profile':
        return <User className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-md z-10">
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
          <button
            type="button"
            className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="accordion-collapse-body-1"
          >
            <span className="text-lg">Email Analysis Results</span>
            <ChevronDown 
              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </h2>
        <div
          id="accordion-collapse-body-1"
          className={`${isOpen ? '' : 'hidden'} absolute top-0 left-0 w-full`}
          aria-labelledby="accordion-collapse-heading-1"
        >
          <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
            <div className="space-y-4">
              {Object.entries(analysisData).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(key)}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{key}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getBadgeClasses(value)}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisAccordion; 