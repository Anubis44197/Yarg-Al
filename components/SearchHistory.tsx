import React, { useMemo } from 'react';
import type { HistoryItem } from '../types';

interface SearchHistoryProps {
    history: HistoryItem[];
    onHistoryClick: (term: string) => void;
    onClearHistory: () => void;
    onTogglePin: (term: string) => void;
}

const HistoryButton: React.FC<{ item: HistoryItem, onHistoryClick: (term: string) => void, onTogglePin: (term: string) => void }> = ({ item, onHistoryClick, onTogglePin }) => {
    return (
        <div className="group relative flex items-center bg-slate-700 rounded-full transition-colors duration-200 hover:bg-slate-600">
            <button
                onClick={() => onHistoryClick(item.term)}
                className="py-1 pl-3 pr-9 text-blue-200 text-sm font-medium"
                style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={item.term}
            >
                {item.term}
            </button>
            <button
                onClick={() => onTogglePin(item.term)}
                className="absolute right-0 top-0 bottom-0 px-2 rounded-r-full flex items-center justify-center bg-slate-700/50 hover:bg-slate-500/80"
                aria-label={item.pinned ? "Sabitlemeyi kaldır" : "Sabitle"}
                title={item.pinned ? "Sabitlemeyi kaldır" : "Sabitle"}
            >
                <svg className={`w-4 h-4 transition-colors ${item.pinned ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.868 2.884c.321-.772.115-1.625-.4-2.131A1.5 1.5 0 008.35.146L7.5 1.25V5a.5.5 0 00.5.5h3.25a.5.5 0 00.5-.5V1.25L11.53.146a1.5 1.5 0 00-1.082-.28z" clipRule="evenodd" />
                    <path d="M10.868 2.884A1.5 1.5 0 0112 4.135V9.25a.5.5 0 01-1 0V4.635a.5.5 0 00-.5-.5H8.5a.5.5 0 00-.5.5v4.615a.5.5 0 01-1 0V4.135a1.5 1.5 0 011.132-1.251L10.868 2.884z" />
                    <path d="M4.5 5.5a.5.5 0 00-.5.5v5.25a.5.5 0 001 0V6a.5.5 0 00-.5-.5zM15.5 5.5a.5.5 0 00-.5.5v5.25a.5.5 0 001 0V6a.5.5 0 00-.5-.5z" />
                    <path d="M3 13.5A1.5 1.5 0 014.5 12h11a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 0115.5 16h-2.086a.5.5 0 00-.354.146L12 17.293l-1.06-1.147a.5.5 0 00-.354-.146H4.5A1.5 1.5 0 013 14.5v-1z" />
                </svg>
            </button>
        </div>
    );
};


const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onHistoryClick, onClearHistory, onTogglePin }) => {

    const { pinned, recent } = useMemo(() => {
        const pinned = history.filter(h => h.pinned);
        const recent = history.filter(h => !h.pinned);
        return { pinned, recent };
    }, [history]);

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-3xl mb-4 p-4 bg-slate-800/70 rounded-lg border border-slate-700 animate-fade-in backdrop-blur-sm">
            {pinned.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10.868 2.884c.321-.772.115-1.625-.4-2.131A1.5 1.5 0 008.35.146L7.5 1.25V5a.5.5 0 00.5.5h3.25a.5.5 0 00.5-.5V1.25L11.53.146a1.5 1.5 0 00-1.082-.28z" clipRule="evenodd" />
                           <path d="M10.868 2.884A1.5 1.5 0 0112 4.135V9.25a.5.5 0 01-1 0V4.635a.5.5 0 00-.5-.5H8.5a.5.5 0 00-.5.5v4.615a.5.5 0 01-1 0V4.135a1.5 1.5 0 011.132-1.251L10.868 2.884z" />
                           <path d="M4.5 5.5a.5.5 0 00-.5.5v5.25a.5.5 0 001 0V6a.5.5 0 00-.5-.5zM15.5 5.5a.5.5 0 00-.5.5v5.25a.5.5 0 001 0V6a.5.5 0 00-.5-.5z" />
                           <path d="M3 13.5A1.5 1.5 0 014.5 12h11a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 0115.5 16h-2.086a.5.5 0 00-.354.146L12 17.293l-1.06-1.147a.5.5 0 00-.354-.146H4.5A1.5 1.5 0 013 14.5v-1z" />
                        </svg>
                        Sabitlenmiş Aramalar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {pinned.map((item) => <HistoryButton key={item.term} item={item} onHistoryClick={onHistoryClick} onTogglePin={onTogglePin} />)}
                    </div>
                </div>
            )}
            
            {recent.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-slate-400">Son Aramalar</h3>
                        <button
                            onClick={onClearHistory}
                            className="text-xs text-slate-400 hover:text-blue-200 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                            aria-label="Arama geçmişini temizle"
                        >
                            Geçmişi Temizle
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recent.map((item) => <HistoryButton key={item.term} item={item} onHistoryClick={onHistoryClick} onTogglePin={onTogglePin} />)}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SearchHistory;