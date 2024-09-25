import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(query);
    }
  };

  return (
    <form className="flex items-center">
      <div className="relative flex-grow group ml-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress} // Changed from onKeyPress to onKeyDown
          placeholder={placeholder}
          className="border-2 border-gray-300 rounded-lg px-6 py-1 w-full pl-12 text-lg focus:outline-none focus:border-gold-500 transition duration-200 ease-in-out shadow-lg transform group-hover:scale-105 focus:scale-105"
        />
        <svg
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gold-500 transition duration-300 ease-in-out group-hover:scale-105 group-focus:scale-105"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </form>
  );
};

export default SearchBar;