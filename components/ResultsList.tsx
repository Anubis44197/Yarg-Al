import React, { useMemo } from 'react';

import ResultItem from './ResultItem';
import type { Decision } from '../types';

interface ResultsListProps {
    results: Decision[];
    onDecisionClick: (decision: Decision) => void;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    totalResults: number;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, onDecisionClick, onLoadMore, hasMore, isLoadingMore, totalResults }) => {

    const groupedResults = useMemo(() => {
        if (!results) return {};
        return results.reduce((acc, decision) => {
            const court = decision.court || 'Diğer';
            if (!acc[court]) {
                acc[court] = [];
            }
            acc[court].push(decision);
            return acc;
        }, {} as Record<string, Decision[]>);
    }, [results]);

    const courtOrder = ['Anayasa Mahkemesi', 'Yargıtay', 'Danıştay', 'Bölge Adliye Mahkemesi', 'Yerel Mahkeme'];
    const sortedCourts = Object.keys(groupedResults).sort((a, b) => {
        const indexA = courtOrder.indexOf(a);
        const indexB = courtOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        if (a === 'Diğer') return 1;
        if (b === 'Diğer') return -1;
        return a.localeCompare(b);
    });

    if (results.length === 0) {
        return (
            <div className="text-center mt-12">
                <h2 className="text-2xl font-bold text-brand-text">Sonuç Bulunamadı</h2>
                <p className="text-brand-text-secondary mt-2">
                    Arama kriterlerinize uygun bir belge bulunamadı. Lütfen farklı bir sorgu deneyin.
                </p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center w-full">
            <p className="text-brand-text-secondary mb-6">{`Toplam ${totalResults} sonuç bulundu. (${results.length} gösteriliyor)`}</p>
            <div className="space-y-8 w-full">
                {sortedCourts.map(court => (
                    <section key={court}>
                        <h2 className="text-2xl font-bold text-brand-text mb-4 pb-2 border-b-2 border-slate-700 flex items-baseline">
                            <span>{court} Kararları</span>
                            <span className="ml-3 text-lg font-medium text-brand-text-secondary">
                                ({groupedResults[court].length})
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {groupedResults[court].map((decision) => (
                                <ResultItem key={decision.id} decision={decision} onClick={onDecisionClick} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="px-8 py-3 bg-brand-blue text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-blue disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResultsList;
