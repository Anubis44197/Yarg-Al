import React from 'react';

interface MCPStatusIndicatorProps {
    isConnected: boolean;
    isConnecting: boolean;
    onClick: () => void;
}

const MCPStatusIndicator: React.FC<MCPStatusIndicatorProps> = ({ isConnected, isConnecting, onClick }) => {
    
    const getStatusStyles = () => {
        if (isConnecting) {
            return {
                bgColor: 'bg-yellow-500/20',
                textColor: 'text-yellow-400',
                dotColor: 'bg-yellow-400 animate-pulse',
                text: 'Kontrol Ediliyor'
            };
        }
        if (isConnected) {
            return {
                bgColor: 'bg-green-500/20',
                textColor: 'text-green-400',
                dotColor: 'bg-green-400',
                text: 'MCP Bağlı'
            };
        }
        return {
            bgColor: 'bg-red-500/20',
            textColor: 'text-red-400',
            dotColor: 'bg-red-400',
            text: 'MCP Bağlı Değil'
        };
    };

    const { bgColor, textColor, dotColor, text } = getStatusStyles();

    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${bgColor} ${textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-blue`}
            aria-label={`MCP Sunucu Durumu: ${text}. Ayarları açmak için tıklayın.`}
        >
            <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
            <span>{text}</span>
        </button>
    );
};

export default MCPStatusIndicator;
