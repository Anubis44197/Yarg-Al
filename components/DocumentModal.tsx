import React, { useEffect, useState, useMemo } from 'react';
import { summarizeWithGemini, getDocument } from '../services/geminiService';
import type { Decision } from '../types';
import { CopyButton } from './CopyButton';

interface DocumentModalProps {
    decision: Decision;
    onClose: () => void;
    searchQuery: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ decision, onClose, searchQuery }) => {
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [fullText, setFullText] = useState<string | null>(decision.fullText || null);
    const [isFetchingText, setIsFetchingText] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        if (!fullText) {
            setIsFetchingText(true);
            getDocument(decision)
                .then(text => setFullText(text))
                .catch(err => setFetchError("Belge metni yüklenirken bir hata oluştu."))
                .finally(() => setIsFetchingText(false));
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, decision, fullText]);

    const handleSummarize = async () => {
        if (!fullText) return;
        setIsSummarizing(true);
        setAiSummary(null);
        const summary = await summarizeWithGemini(fullText);
        setAiSummary(summary);
        setIsSummarizing(false);
    };
    
    const highlightedText = useMemo(() => {
        if (!fullText || !searchQuery) {
            return fullText;
        }
        try {
            // Birden çok kelimeyi ayır ve her birini vurgula
            const queryWords = searchQuery.split(/\s+/).filter(word => word.length > 2);
            if(queryWords.length === 0) return fullText;

            const regex = new RegExp(`(${queryWords.join('|')})`, 'gi');
            return fullText.replace(regex, '<mark class="bg-yellow-500/40 text-yellow-100 rounded px-1 py-0.5">$1</mark>');
        } catch (e) {
            console.error("Vurgulama sırasında regex hatası:", e);
            return fullText;
        }
    }, [fullText, searchQuery]);


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-blue-400">{decision.title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="flex items-center text-sm text-slate-400 mb-4 flex-wrap gap-x-2">
                        <span>Tarih: {decision.date}</span>
                        <span className="mx-2 hidden sm:inline">|</span>
                        <span>Karar No: {decision.decisionNumber}</span>
                        {decision.court && <><span className="mx-2 hidden sm:inline">|</span><span>Mahkeme: {decision.court}</span></>}
                        {decision.documentUrl && <><span className="mx-2 hidden sm:inline">|</span><a href={decision.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Kaynağı Görüntüle</a></>}
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing || isFetchingText || !fullText}
                            className="inline-flex items-center px-4 py-2 bg-blue-400/20 text-blue-200 font-semibold rounded-md hover:bg-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <svg className={`w-5 h-5 mr-2 ${isSummarizing ? 'animate-pulse-magic' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                            </svg>
                            {isSummarizing ? 'Özetleniyor...' : (isFetchingText ? 'Metin Yükleniyor...' : 'AI ile Özetle')}
                        </button>
                        {aiSummary && (
                            <div className="mt-4 p-4 bg-gradient-to-br from-slate-800/60 to-slate-900/50 rounded-lg border border-blue-400/30 shadow-lg animate-fade-in-summary relative">
                                <div className="absolute top-3 right-3">
                                    <CopyButton textToCopy={aiSummary} />
                                </div>
                                <h4 className="font-bold text-lg text-blue-200 mb-2">Yapay Zeka Özeti</h4>
                                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
                        <h4 className="font-bold text-slate-200">Özet:</h4>
                        <p>{decision.summary}</p>
                        <hr className="my-4 border-slate-700" />
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-200">Tam Metin:</h4>
                            {fullText && !isFetchingText && <CopyButton textToCopy={fullText} />}
                        </div>
                        
                        {isFetchingText ? (
                            <div className="space-y-3 animate-pulse mt-2">
                                <div className="h-4 bg-slate-700 rounded w-full"></div>
                                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-700 rounded w-full"></div>
                                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        ) : fetchError ? (
                            <p className="text-red-400 mt-2">{fetchError}</p>
                        ) : (
                            <p className="mt-2" dangerouslySetInnerHTML={{ __html: highlightedText || '' }}></p>
                        )}
                    </div>
                </div>
                <div className="p-4 border-t border-slate-700 text-right">
                    <button onClick={onClose} className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors">Kapat</button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                @keyframes fade-in-summary { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-summary { animation: fade-in-summary 0.5s ease-out forwards; }
                 @keyframes pulse-magic { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
                .animate-pulse-magic { animation: pulse-magic 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
};

export default DocumentModal;