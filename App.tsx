import React, { useState, useCallback, useEffect } from 'react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import InitialState from './components/InitialState';
import ResultsList from './components/ResultsList';
import DocumentModal from './components/DocumentModal';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import SearchHistory from './components/SearchHistory';
import MCPSettingsModal from './components/MCPSettingsModal';
import { searchDocuments, checkMCPConnection } from './services/geminiService';
import type { Decision, HistoryItem } from './types';

const RESULTS_PER_PAGE = 50;

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Decision[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [isMCPConnected, setIsMCPConnected] = useState(false);
    const [isCheckingMCP, setIsCheckingMCP] = useState(true);
    const [isMCPSettingsOpen, setIsMCPSettingsOpen] = useState(false);

    const [searchHistory, setSearchHistory] = useState<HistoryItem[]>(() => {
        try {
            const item = window.localStorage.getItem('yargiAI-searchHistory');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error("Arama geçmişi okunurken hata oluştu:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('yargiAI-searchHistory', JSON.stringify(searchHistory));
        } catch (error) {
            console.error("Arama geçmişi kaydedilirken hata oluştu:", error);
        }
    }, [searchHistory]);

    const handleCheckConnection = useCallback(async () => {
        setIsCheckingMCP(true);
        const isConnected = await checkMCPConnection();
        setIsMCPConnected(isConnected);
        setIsCheckingMCP(false);
        return isConnected;
    }, []);

    useEffect(() => {
        handleCheckConnection();
    }, [handleCheckConnection]);

    const updateSearchHistory = (term: string) => {
        setSearchHistory(prev => {
            const filtered = prev.filter(item => item.term !== term);
            const newHistory: HistoryItem[] = [{ term, pinned: false }, ...filtered];
            const pinned = newHistory.filter(i => i.pinned);
            const unpinned = newHistory.filter(i => !i.pinned).slice(0, 10);
            return [...pinned, ...unpinned];
        });
    };

    const performSearch = useCallback(async (searchTerm: string, page: number = 1) => {
        if (!isMCPConnected) {
            setError("Lütfen arama yapmadan önce MCP sunucu bağlantısını kurun.");
            setIsMCPSettingsOpen(true);
            return;
        }

        const trimmedQuery = searchTerm.trim();
        if (!trimmedQuery) {
            setError('Lütfen bir arama sorgusu girin.');
            return;
        }

        if (page === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        if (page === 1) {
            setResults([]);
            setTotalResults(0);
        }

        setHasSearched(true);
        setError(null);
        
        if (page === 1) updateSearchHistory(trimmedQuery);

        try {
            const response = await searchDocuments(trimmedQuery, page, RESULTS_PER_PAGE);
            if (response.error) {
                setError(response.error);
            } else {
                setResults(prev => page === 1 ? response.results : [...prev, ...response.results]);
                setTotalResults(response.total);
                setCurrentPage(page);
            }
        } catch (err) {
            setError('Arama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [isMCPConnected]);

    const handleSearch = useCallback(() => {
        performSearch(query, 1);
    }, [query, performSearch]);
    
    const handleLoadMore = useCallback(() => {
        performSearch(query, currentPage + 1);
    }, [query, currentPage, performSearch]);

    const hasMoreResults = results.length < totalResults;

    const handleHistoryClick = (term: string) => {
        setQuery(term);
        performSearch(term, 1);
    };
    
    const handleClearHistory = () => {
        setSearchHistory(prev => prev.filter(item => item.pinned));
    };

    const handleTogglePin = (termToToggle: string) => {
        setSearchHistory(prev => {
            const updated = prev.map(item => 
                item.term === termToToggle ? { ...item, pinned: !item.pinned } : item
            );
            return updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));
        });
    };
    
    const handleDecisionClick = (decision: Decision) => {
        setSelectedDecision(decision);
    };

    const closeModal = () => {
        setSelectedDecision(null);
    };

    const isSearchDisabled = isLoading || !isMCPConnected;

    return (
        <div className="flex flex-col min-h-screen bg-brand-dark font-sans">
            <Header 
                isMCPConnected={isMCPConnected}
                isCheckingMCP={isCheckingMCP}
                onStatusClick={() => setIsMCPSettingsOpen(true)}
            />
            <main className="flex-grow flex flex-col items-center p-4 md:p-8 w-full">
                <div className="w-full max-w-4xl text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-3 tracking-tight">
                        Yapay Zeka Destekli Hukuki Belge Arama
                    </h1>
                    <p className="text-brand-text-secondary text-lg">
                        Doğal dil kullanarak ilgili makaleleri ve mahkeme kararlarını bulun.
                    </p>
                </div>

                <div className="w-full max-w-2xl mb-4">
                    <SearchBar
                        query={query}
                        setQuery={setQuery}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        isDisabled={isSearchDisabled}
                    />
                     {!isMCPConnected && !isCheckingMCP && (
                        <p className="text-yellow-400 text-center mt-3 text-sm">
                            Arama yapabilmek için MCP sunucu bağlantısı gerekli. Lütfen sağ üstteki durum menüsünden kurulumu tamamlayın.
                        </p>
                    )}
                </div>
                
                 {searchHistory.length > 0 && (
                     <SearchHistory 
                        history={searchHistory}
                        onHistoryClick={handleHistoryClick}
                        onClearHistory={handleClearHistory}
                        onTogglePin={handleTogglePin}
                    />
                )}
                
                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                
                <div className="w-full max-w-4xl flex-grow mt-8">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : !hasSearched ? (
                        <InitialState />
                    ) : (
                        <ResultsList 
                            results={results} 
                            onDecisionClick={handleDecisionClick}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMoreResults}
                            isLoadingMore={isLoadingMore}
                            totalResults={totalResults}
                        />
                    )}
                </div>

            </main>
            <Footer />
            {selectedDecision && (
                <DocumentModal decision={selectedDecision} onClose={closeModal} />
            )}
            <MCPSettingsModal 
                isOpen={isMCPSettingsOpen}
                onClose={() => setIsMCPSettingsOpen(false)}
                onConnectionTest={handleCheckConnection}
                isCurrentlyConnected={isMCPConnected}
            />
        </div>
    );
};

export default App;
