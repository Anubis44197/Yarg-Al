import React from 'react';
import type { Decision } from '../types';

interface ResultItemProps {
    decision: Decision;
    onClick: (decision: Decision) => void;
}

const getCourtColor = (court?: string) => {
    switch (court) {
        case 'Anayasa Mahkemesi':
            return 'bg-purple-500/20 text-purple-300';
        case 'Yargıtay':
            return 'bg-red-500/20 text-red-300';
        case 'Danıştay':
            return 'bg-sky-500/20 text-sky-300';
        case 'Bölge Adliye Mahkemesi':
            return 'bg-yellow-500/20 text-yellow-300';
        default:
            return 'bg-slate-600 text-slate-300';
    }
}

const ResultItem: React.FC<ResultItemProps> = ({ decision, onClick }) => {
    return (
        <div 
            className="bg-slate-800 p-6 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors duration-200 border border-slate-700 hover:border-blue-400"
            onClick={() => onClick(decision)}
        >
            <h3 className="text-xl font-bold text-blue-400 mb-2">{decision.title}</h3>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm text-slate-400 mb-3">
                {decision.court && (
                    <span className={`py-0.5 px-2.5 rounded-full text-xs font-semibold ${getCourtColor(decision.court)}`}>
                        {decision.court}
                    </span>
                )}
                <span>{decision.date}</span>
                <span className="hidden md:inline">|</span>
                <span>{decision.decisionNumber}</span>
            </div>
            <p className="text-slate-400 line-clamp-3">{decision.summary}</p>
        </div>
    );
};

export default ResultItem;