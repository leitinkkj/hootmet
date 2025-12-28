import React, { useState } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

const FloatingMessages = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [msg, setMsg] = useState('');

    const chats = [
        { id: 1, name: 'Juliana', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', lastMsg: 'Oi! Vi seu perfil 😊', time: '2 min', unread: 2, status: 'online' },
        { id: 2, name: 'Camila', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', lastMsg: 'Vamos marcar algo?', time: '15 min', unread: 1, status: 'typing' },
        { id: 3, name: 'Amanda', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', lastMsg: 'Adorei conhecer você!', time: '1h', unread: 0, status: 'busy' },
    ];

    const total = chats.reduce((a, c) => a + c.unread, 0);

    return (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 safe-area-bottom">

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] bg-glass rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10">

                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#FF3D81]/20 to-[#8B5CF6]/20 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-[#FF3D81]" />
                            <span className="font-bold">Mensagens</span>
                            {total > 0 && (
                                <span className="bg-[#FF2D55] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {total}
                                </span>
                            )}
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {activeChat ? (
                        <div className="flex flex-col h-80">
                            <div className="flex items-center gap-3 p-3 border-b border-white/5">
                                <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white">←</button>
                                <img src={activeChat.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{activeChat.name}</p>
                                    <StatusIndicator status={activeChat.status} size="sm" showLabel />
                                </div>
                            </div>
                            <div className="flex-1 p-3 overflow-y-auto">
                                <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%]">
                                    <p className="text-sm">{activeChat.lastMsg}</p>
                                </div>
                            </div>
                            <div className="p-3 border-t border-white/5">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={msg}
                                        onChange={(e) => setMsg(e.target.value)}
                                        placeholder="Digite..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-[#FF3D81]/50"
                                    />
                                    <button className="p-2.5 bg-gradient-to-r from-[#FF3D81] to-[#FF6B35] rounded-xl">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">
                            {chats.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setActiveChat(c)}
                                    className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-white/5 active:bg-white/10 border-b border-white/5 last:border-b-0"
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={c.avatar} alt="" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover" />
                                        <div className="absolute -bottom-0.5 -right-0.5">
                                            <StatusIndicator status={c.status} size="sm" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className="font-semibold text-sm truncate">{c.name}</p>
                                            <span className="text-[10px] text-gray-500 ml-2">{c.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{c.lastMsg}</p>
                                    </div>
                                    {c.unread > 0 && (
                                        <span className="w-5 h-5 bg-[#FF2D55] rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                                            {c.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FF3D81] to-[#8B5CF6] rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                style={{ boxShadow: '0 8px 32px rgba(255, 61, 129, 0.4)' }}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                {!isOpen && total > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF2D55] rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                        {total}
                    </span>
                )}
            </button>
        </div>
    );
};

export default FloatingMessages;
