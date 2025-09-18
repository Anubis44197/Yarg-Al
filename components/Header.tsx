import React from 'react';
import MCPStatusIndicator from './MCPStatusIndicator';

interface HeaderProps {
    isMCPConnected: boolean;
    isCheckingMCP: boolean;
    onStatusClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMCPConnected, isCheckingMCP, onStatusClick }) => {
    return (
        <header className="w-full p-4 md:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
                    <path d="M12 3L4 7V11C4 16.5 7.58 21.73 12 23C16.42 21.73 20 16.5 20 11V7L12 3ZM10.5 16.5L6.5 12.5L7.91 11.09L10.5 13.67L16.09 8.09L17.5 9.5L10.5 16.5Z" fill="currentColor"/>
                    <path d="M12 1L21 6V11C21 16.5 17.42 21.73 12 23C6.58 21.73 3 16.5 3 11V6L12 1ZM12 4.03L5 8.5V11C5 15.95 8.16 20.45 12 21.82C15.84 20.45 19 15.95 19 11V8.5L12 4.03Z" fill="currentColor" opacity="0.6"/>
                </svg>
                <h1 className="text-2xl font-bold text-slate-200 ml-2">Yargı AI</h1>
            </div>
            <MCPStatusIndicator 
                isConnected={isMCPConnected}
                isConnecting={isCheckingMCP}
                onClick={onStatusClick}
            />
        </header>
    );
};

export default Header;