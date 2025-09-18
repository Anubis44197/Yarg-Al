import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full p-4 md:p-8 mt-auto">
            <div className="flex justify-between items-center max-w-6xl mx-auto text-slate-400 text-sm">
                <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg">
                    N
                </div>
                <p>© 2025 Yargı AI. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
};

export default Footer;