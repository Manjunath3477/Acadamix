import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, XIcon } from '../icons/Icons';

const SearchBar = ({ 
    placeholder = "Search...", 
    onSearch, 
    suggestions = [], 
    showSuggestions = false,
    className = ""
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length > 0 && showSuggestions);
        setSelectedIndex(-1);
        onSearch?.(value);
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.title || suggestion);
        setIsOpen(false);
        setSelectedIndex(-1);
        onSearch?.(suggestion.title || suggestion);
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
        onSearch?.('');
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={suggestionsRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(query.length > 0 && showSuggestions)}
                    placeholder={placeholder}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-large max-h-64 overflow-auto animate-fade-in">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                                index === selectedIndex
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                            } ${index === 0 ? 'rounded-t-xl' : ''} ${
                                index === suggestions.length - 1 ? 'rounded-b-xl' : ''
                            }`}
                        >
                            <div className="flex items-center">
                                <SearchIcon className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="font-medium">
                                    {suggestion.title || suggestion}
                                </span>
                                {suggestion.category && (
                                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        {suggestion.category}
                                    </span>
                                )}
                            </div>
                            {suggestion.description && (
                                <p className="text-sm text-gray-500 mt-1 ml-7">
                                    {suggestion.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
