import React, { useEffect, useState } from 'react';

interface MCPSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnectionTest: () => Promise<boolean>;
    isCurrentlyConnected: boolean;
}

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors" aria-label="Kopyala">
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};

const setupSteps = [
    {
        id: 1,
        label: 'Gereksinimleri Yükle',
        description: 'Kuruluma başlamadan önce sisteminizde (Windows) şu araçların yüklü olduğundan emin olun:',
        content: (
            <ul className="list-disc list-inside space-y-2 pl-1">
                <li><a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Git (Proje dosyalarını indirmek için)</a></li>
                <li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Python 3.8+ (Kurulumda "Add Python to PATH" seçeneğini işaretleyin)</a></li>
                <li><a href="https://aka.ms/vs/17/release/vc_redist.x64.exe" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Microsoft Visual C++ Redistributable</a></li>
            </ul>
        )
    },
    {
        id: 2,
        label: 'Projeyi İndir ve Klasöre Gir',
        description: 'Bir terminal (Komut İstemi veya PowerShell) açın ve aşağıdaki komutları sırasıyla çalıştırın:',
        commands: [
            'git clone https://github.com/saidsurucu/yargi-mcp.git',
            'cd yargi-mcp'
        ]
    },
    {
        id: 3,
        label: 'Bağımlılıkları Yükle',
        description: 'Proje klasörünün içindeyken gerekli tüm Python paketlerini yüklemek için bu komutu çalıştırın:',
        commands: ['pip install -e ".[asgi]"']
    },
    {
        id: 4,
        label: 'Sunucuyu Başlat',
        description: 'Artık sunucuyu başlatabilirsiniz. Sunucu çalıştığı sürece bu terminal penceresini kapatmayın.',
        commands: ['python run_asgi.py']
    }
];

const MCPSettingsModal: React.FC<MCPSettingsModalProps> = ({ isOpen, onClose, onConnectionTest, isCurrentlyConnected }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'failure' | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTestResult(null); 
            setCurrentStep(1);
        }
    }, [isOpen]);

    const handleTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        const success = await onConnectionTest();
        setTestResult(success ? 'success' : 'failure');
        setIsTesting(false);
        if (success) {
            setTimeout(onClose, 1500);
        }
    };
    
    if (!isOpen) return null;
    
    const step = setupSteps[currentStep - 1];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-light-dark rounded-lg shadow-2xl max-w-3xl w-full flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-brand-text">MCP Sunucu Kurulum Sihirbazı</h2>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    <div className="p-4 bg-brand-blue/10 rounded-lg border border-brand-blue/30">
                        <h3 className="font-bold text-brand-light-blue">Bu Nedir?</h3>
                        <p className="text-sm text-brand-text-secondary mt-1">
                            Bu arayüzün çalışması için gereken arama motoru (`yargi-mcp`) sizin bilgisayarınızda çalışmalıdır. Bu sihirbaz, motoru nasıl kurup çalıştıracağınızı gösterir.
                        </p>
                    </div>
                    
                    {isCurrentlyConnected ? (
                        <div className="p-4 text-center bg-green-500/20 text-green-400 rounded-lg">
                            <p className="font-semibold">MCP sunucusuna bağlısınız. Arama yapmaya hazırsınız!</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-brand-text text-lg">{`Adım ${step.id}: ${step.label}`}</h4>
                                <span className="text-sm text-brand-text-secondary">{`${step.id} / ${setupSteps.length}`}</span>
                            </div>
                            <p className="text-sm text-brand-text-secondary mb-4">{step.description}</p>
                            {step.content}
                            {step.commands && (
                                <div className="space-y-2 pt-1">
                                    {step.commands.map(cmd => (
                                        <div key={cmd} className="relative">
                                            <pre className="bg-slate-900 text-brand-light-blue text-sm p-3 pr-12 rounded-md font-mono whitespace-pre-wrap break-all">
                                                <code>{cmd}</code>
                                            </pre>
                                            <CopyButton textToCopy={cmd} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-slate-700 space-y-4">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => setCurrentStep(s => s - 1)}
                            disabled={currentStep === 1 || isCurrentlyConnected}
                            className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Geri
                        </button>
                        {currentStep < setupSteps.length ? (
                            <button 
                                onClick={() => setCurrentStep(s => s + 1)}
                                disabled={isCurrentlyConnected}
                                className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                İleri
                            </button>
                        ) : (
                            <button 
                                onClick={handleTest}
                                disabled={isTesting || isCurrentlyConnected}
                                className="w-auto inline-flex justify-center items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isTesting && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isTesting ? 'Test Ediliyor...' : 'Tüm Adımları Tamamladım, Test Et'}
                            </button>
                        )}
                    </div>
                    {testResult === 'success' && <p className="text-green-400 text-center animate-fade-in-up">Bağlantı başarılı! Pencere kapanıyor...</p>}
                    {testResult === 'failure' && <p className="text-red-400 text-center animate-fade-in-up">Bağlantı kurulamadı. Lütfen sunucunun terminalde çalıştığından ve hata mesajı olmadığından emin olun.</p>}
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default MCPSettingsModal;
