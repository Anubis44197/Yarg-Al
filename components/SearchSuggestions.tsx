import React from 'react';

interface SearchSuggestionsProps {
    onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
    "kira sözleşmesinin haksız feshi",
    "işe iade davası",
    "boşanma davasında mal paylaşımı",
    "tahliye taahhütnamesi geçerliliği",
    "rekabet hukuku ihlali",
    "ifade özgürlüğü anayasa mahkemesi"
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSuggestionClick }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {suggestions.map((suggestion) => (
                <button
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="py-2 px-4 bg-slate-800 border border-slate-600 rounded-full text-blue-200 hover:bg-slate-700 hover:border-blue-400 transition-all duration-200"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
};

export default SearchSuggestions;