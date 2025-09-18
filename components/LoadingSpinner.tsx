import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Sorgu analiz ediliyor...",
    "Sorgu MCP motoruna iletiliyor...",
    "Birleşik veri tabanında arama yapılıyor...",
    "İlgili kararlar taranıyor...",
    "Sonuçlar analiz ediliyor...",
    "Neredeyse hazır..."
];

const LoadingSpinner: React.FC = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500); // Mesajı her 2.5 saniyede bir değiştir

        return () => clearInterval(interval); // Bileşen kaldırıldığında interval'i temizle
    }, []);

    return (
        <div className="flex justify-center items-center mt-12 flex-col">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
            <p key={currentMessageIndex} className="mt-4 text-lg text-slate-400 animate-fade-in-message">
                {loadingMessages[currentMessageIndex]}
            </p>
            <style>{`
                @keyframes fade-in-message {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-message {
                    animation: fade-in-message 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;