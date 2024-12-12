import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('last7days');
  const menuRef = useRef(null);

  const filterOptions = [
    { id: 'lastDay', label: 'Last day' },
    { id: 'last7days', label: 'Last 7 days' },
    { id: 'last30days', label: 'Last 30 days' },
    { id: 'lastMonth', label: 'Last month' },
    { id: 'lastYear', label: 'Last year' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border rounded-lg px-3 py-2 hover:bg-gray-50"
      >
        <Filter className="w-5 h-5 mr-2" />
        Filter
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg z-50">
          <ul className="p-3 space-y-1 text-sm text-gray-700">
            {filterOptions.map((option) => (
              <li key={option.id}>
                <div className="flex items-center p-2 rounded hover:bg-gray-100">
                  <input
                    id={`filter-${option.id}`}
                    type="radio"
                    name="filter-radio"
                    value={option.id}
                    checked={selectedFilter === option.id}
                    onChange={() => setSelectedFilter(option.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`filter-${option.id}`}
                    className="w-full ms-2 text-sm font-medium text-gray-900 rounded"
                  >
                    {option.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterMenu; 