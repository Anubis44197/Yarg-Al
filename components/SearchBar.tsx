import React from 'react';

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    onSearch: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading, isDisabled }) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isDisabled) {
            onSearch();
        }
    };

    const handleClear = () => {
        setQuery('');
    };

    const isButtonDisabled = isLoading || isDisabled;

    return (
        <div className="relative flex items-center w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isDisabled ? "Lütfen önce MCP sunucusunu bağlayın" : "e.g., adil yargılanma hakkı ihlali"}
                className="w-full pl-12 pr-40 py-4 text-lg bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-slate-200 placeholder-slate-400 disabled:bg-slate-800 disabled:cursor-not-allowed"
                disabled={isDisabled}
                aria-disabled={isDisabled}
            />
            {query && !isDisabled && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-28 mr-2 flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label="Aramayı temizle"
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            <button
                onClick={onSearch}
                disabled={isButtonDisabled}
                className="absolute inset-y-0 right-0 m-2 px-6 py-2 bg-blue-400 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {isLoading ? 'Aranıyor...' : 'Ara'}
            </button>
        </div>
    );
};

export default SearchBar;