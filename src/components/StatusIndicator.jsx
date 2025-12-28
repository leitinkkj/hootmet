import React from 'react';

export const StatusIndicator = ({ status = 'offline', size = 'md', showLabel = false }) => {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
    };

    const config = {
        online: { color: 'bg-[#00FF87]', animation: 'status-online', label: 'Online' },
        busy: { color: 'bg-[#FF6B35]', animation: 'status-busy', label: 'Ocupada' },
        offline: { color: 'bg-gray-500', animation: '', label: 'Offline' },
        typing: { isTyping: true, label: 'Digitando...' },
    };

    const cfg = config[status] || config.offline;

    if (cfg.isTyping) {
        return (
            <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                        <span key={i} className="typing-dot w-1 h-1 rounded-full bg-[#00FF87]" />
                    ))}
                </div>
                {showLabel && <span className="text-[10px] text-[#00FF87] font-medium ml-1">{cfg.label}</span>}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <span className={`${sizes[size]} ${cfg.color} ${cfg.animation} rounded-full`} />
            {showLabel && (
                <span className={`text-[10px] font-semibold ${status === 'online' ? 'text-[#00FF87]' : status === 'busy' ? 'text-[#FF6B35]' : 'text-gray-400'
                    }`}>{cfg.label}</span>
            )}
        </div>
    );
};

export default StatusIndicator;
