import React from 'react';
import SearchSuggestions from './SearchSuggestions';

interface InitialStateProps {
    onSuggestionClick: (suggestion: string) => void;
}


const InitialState: React.FC<InitialStateProps> = ({ onSuggestionClick }) => {
    return (
        <div className="text-center mt-12 flex flex-col items-center">
            <div className="bg-slate-800 p-6 rounded-full mb-6">
                <svg className="w-12 h-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.5 21.5l3-3m0 0l-3-3m3 3h-6" opacity="0.8" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-200">Aramaya Başlayın</h2>
            <p className="text-slate-400 mt-2 mb-8 max-w-xl mx-auto">
                İlgili hukuki belgeleri bulmak için yukarıya bir sorgu girin veya aşağıdaki popüler konulardan birini deneyin.
            </p>
            <SearchSuggestions onSuggestionClick={onSuggestionClick} />
        </div>
    );
};

export default InitialState;