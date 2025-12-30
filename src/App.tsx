import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
import './index.css';
import FuturisticBackground from './components/FuturisticBackground';
import WelcomeToast from './components/WelcomeToast';
import { getUserLocation, saveUserLocation, getSavedLocation } from './services/geolocation';


/* ==================== TYPES ==================== */
interface Profile {
    id: string;
    name: string;
    age: number;
    distance: string;
    photo: string;
    status: string;
    isVerified: boolean;
    isPremium: boolean;
    personality?: string;
}

interface Section {
    title: string;
    icon: string;
    subtitle: string;
    profiles: Profile[];
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ActiveChat {
    profile: Profile;
    messages: ChatMessage[];
    loading: boolean;
    sessionId: string;
    showPremiumButton: boolean;
    showPixButton: boolean;
}

interface AutoChat {
    profile: Profile;
    sessionId: string;
    messages: string[];
    unread: number;
}

/* ==================== ICONS ==================== */
const IconHeart = memo(() => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
    </svg>
));

const IconMenu = memo(() => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
));

const IconSearch = memo(() => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
));

const IconBell = memo(() => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
));

const IconUser = memo(() => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
));

const IconLocation = memo(() => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    </svg>
));

const IconChat = memo(() => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
));

const IconX = memo(() => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
));

const IconChevronLeft = memo(() => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
));

const IconChevronRight = memo(() => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
));

const IconSend = memo(() => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
));

/* ==================== STATUS DOT ==================== */
const StatusDot = memo(({ status }: { status: string }) => {
    const cls = status === 'online' ? 'status-online' : status === 'busy' ? 'status-busy' : 'status-offline';
    return <span className={`status-dot ${cls}`} />;
});

/* ==================== PREMIUM BUTTON ==================== */
const PremiumButton = memo(({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #FF2D55, #FF6B35, #FF8C00)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            animation: 'premiumPulse 2s infinite',
            boxShadow: '0 4px 20px rgba(255, 45, 85, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 45, 85, 0.6)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 45, 85, 0.4)';
        }}
    >
        🧹 Quero a Faxina Especial!
    </button>
));

/* ==================== PIX CHECKOUT BUTTON ==================== */
const PixCheckoutButton = memo(({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #00D4AA, #00B894)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(0, 212, 170, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(1)';
        }}
    >
        💳 Pagar R$70 via PIX
    </button>
));

/* ==================== CHAT MODAL ==================== */
const ChatModal = memo(({
    chat,
    onClose,
    onSendMessage,
    onPremiumClick,
    onPixClick
}: {
    chat: ActiveChat;
    onClose: () => void;
    onSendMessage: (msg: string) => void;
    onPremiumClick: () => void;
    onPixClick: () => void;
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-scroll to bottom
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat.messages]);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} />

            {/* Modal */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                height: '650px',
                maxHeight: '90vh',
                background: '#0E0E14',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'linear-gradient(135deg, rgba(255,45,85,0.1), rgba(139,92,246,0.1))'
                }}>
                    <img
                        src={chat.profile.photo}
                        alt={chat.profile.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '16px' }}>{chat.profile.name}</span>
                            <StatusDot status={chat.profile.status} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#6B6B80' }}>{chat.profile.age} anos • {chat.profile.distance}</span>
                    </div>
                    <button onClick={onClose} className="btn-icon" style={{ width: '36px', height: '36px' }}>
                        <IconX />
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {chat.messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}
                        >
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: msg.role === 'user'
                                    ? 'linear-gradient(135deg, #FF2D55, #FF6B35)'
                                    : 'rgba(255,255,255,0.08)',
                                fontSize: '14px',
                                lineHeight: 1.4
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {chat.loading && (
                        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                            <div style={{
                                padding: '12px 20px',
                                borderRadius: '18px 18px 18px 4px',
                                background: 'rgba(255,255,255,0.08)',
                            }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B6B80', animation: 'pulse 1s infinite' }} />
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B6B80', animation: 'pulse 1s infinite 0.2s' }} />
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B6B80', animation: 'pulse 1s infinite 0.4s' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Premium Button */}
                {chat.showPremiumButton && !chat.showPixButton && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,45,85,0.2)', background: 'rgba(255,45,85,0.05)' }}>
                        <PremiumButton onClick={onPremiumClick} />
                    </div>
                )}

                {/* PIX Checkout Button */}
                {chat.showPixButton && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,212,170,0.2)', background: 'rgba(0,212,170,0.05)' }}>
                        <PixCheckoutButton onClick={onPixClick} />
                    </div>
                )}

                {/* Input */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua mensagem..."
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || chat.loading}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: input.trim() ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'white',
                                cursor: input.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: input.trim() ? 1 : 0.5
                            }}
                        >
                            <IconSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

/* ==================== PROFILE CARD ==================== */
const ProfileCard = memo(({ profile, onStartChat }: { profile: Profile; onStartChat: (p: Profile) => void }) => (
    <div className="card-frame" style={{ width: '180px', flexShrink: 0, cursor: 'pointer' }}>
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
            <img
                src={profile.photo}
                alt={profile.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
                decoding="async"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />

            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between' }}>
                {profile.isPremium && <span className="badge badge-premium">⭐ VIP</span>}
                <span className="badge badge-online" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <StatusDot status={profile.status} />
                    {profile.status === 'online' ? 'Online' : ''}
                </span>
            </div>

            {profile.isVerified && (
                <div style={{ position: 'absolute', bottom: '65px', left: '10px' }}>
                    <span className="badge badge-verified">✓ Verificada</span>
                </div>
            )}
        </div>

        <div style={{ padding: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '3px' }}>
                {profile.name}, {profile.age}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                <span style={{ color: '#FF6B35' }}><IconLocation /></span>
                {profile.distance}
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%', fontSize: '12px', padding: '10px' }}
                onClick={() => onStartChat(profile)}
            >
                <IconChat /> Conversar
            </button>
        </div>
    </div>
));

/* ==================== HORIZONTAL SECTION ==================== */
const HorizontalSection = memo(({ section, onStartChat }: { section: Section; onStartChat: (p: Profile) => void }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });
    };

    return (
        <section style={{ marginBottom: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: '15px' }}>
                <div className="section-header" style={{ marginBottom: 0 }}>
                    <div className="section-icon">{section.icon}</div>
                    <div>
                        <h2 className="section-title">{section.title}</h2>
                        <p className="section-subtitle">{section.subtitle}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => scroll('left')} className="btn-icon"><IconChevronLeft /></button>
                    <button onClick={() => scroll('right')} className="btn-icon"><IconChevronRight /></button>
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30px', background: 'linear-gradient(to right, #08080C, transparent)', zIndex: 5, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30px', background: 'linear-gradient(to left, #08080C, transparent)', zIndex: 5, pointerEvents: 'none' }} />

                <div ref={scrollRef} className="hide-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '5px 20px' }}>
                    {section.profiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} onStartChat={onStartChat} />
                    ))}
                </div>
            </div>
        </section>
    );
});

/* ==================== HEADER ==================== */
const Header = memo(({ onToggleSidebar }: { onToggleSidebar: () => void }) => (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={onToggleSidebar} className="btn-icon"><IconMenu /></button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconHeart />
                    </div>
                    <span className="text-gradient-hot" style={{ fontSize: '18px', fontWeight: 800 }}>Ifoode</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-icon"><IconSearch /></button>
                <button className="btn-icon" style={{ position: 'relative' }}>
                    <IconBell />
                    <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '18px', height: '18px', background: '#FF2D55', borderRadius: '50%', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                </button>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #E91E8C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconUser />
                </div>
            </div>
        </div>
    </header>
));

/* ==================== FILTER SIDEBAR ==================== */
const FilterSidebar = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [distance, setDistance] = useState(25);
    const interests = ['🏔️ Aventura', '🎵 Música', '💪 Fitness', '✈️ Viagens', '🍕 Gastronomia', '🎬 Cinema'];

    if (!isOpen) return null;

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
            <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '270px', background: '#0E0E14', borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🎛️</span>
                        <span style={{ fontSize: '16px', fontWeight: 700 }}>Filtros</span>
                    </div>
                    <button onClick={onClose} className="btn-icon" style={{ width: '34px', height: '34px' }}><IconX /></button>
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
                    <div className="card-frame" style={{ padding: '14px', marginBottom: '14px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>📍 Distância</label>
                        <input type="range" min="1" max="100" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#1C1C28', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B6B80', marginTop: '6px' }}>
                            <span>1 km</span>
                            <span style={{ color: '#FF3D81', fontWeight: 600 }}>{distance} km</span>
                            <span>100 km</span>
                        </div>
                    </div>

                    <div className="card-frame" style={{ padding: '14px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>❤️ Interesses</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {interests.map((i) => (
                                <button key={i} className="btn-secondary" style={{ fontSize: '11px', padding: '6px 10px' }}>{i}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ padding: '18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button className="btn-primary" style={{ width: '100%' }}>Aplicar</button>
                </div>
            </aside>
        </>
    );
});

/* ==================== API FUNCTIONS ==================== */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface SessionStartResponse {
    sessionId: string;
    messages: string[];
}

interface SessionMessageResponse {
    message: string;
    sessionId: string;
    messageCount: number;
    premiumSuggested: boolean;
    shouldShowPremiumButton: boolean;
}

async function startSessionAPI(profile: Profile): Promise<SessionStartResponse> {
    try {
        const res = await fetch(`${API_URL}/api/session/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileId: profile.id,
                name: profile.name,
                age: profile.age,
                personality: profile.personality || 'Simpática, carismática e interessante'
            })
        });
        const data = await res.json();
        return {
            sessionId: data.sessionId || `fallback_${Date.now()}`,
            messages: data.messages || ['Olá! 😊', 'Tudo bem?', 'Adorei seu perfil!']
        };
    } catch {
        return {
            sessionId: `fallback_${Date.now()}`,
            messages: ['Olá! 😊', 'Tudo bem com você?', 'Adorei seu perfil!']
        };
    }
}

async function sendSessionMessageAPI(sessionId: string, message: string): Promise<SessionMessageResponse> {
    try {
        const res = await fetch(`${API_URL}/api/session/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message })
        });
        const data = await res.json();
        return {
            message: data.message || 'Interessante! 😊',
            sessionId: data.sessionId || sessionId,
            messageCount: data.messageCount || 0,
            premiumSuggested: data.premiumSuggested || false,
            shouldShowPremiumButton: data.shouldShowPremiumButton || false
        };
    } catch {
        return {
            message: 'Que legal! Me conta mais 😊',
            sessionId,
            messageCount: 0,
            premiumSuggested: false,
            shouldShowPremiumButton: false
        };
    }
}

/* ==================== STATIC DATA ==================== */

// TOP 3 DA CIDADE
const TOP3_PROFILES: Profile[] = [
    { id: 'top-1', name: 'Valentina', age: 23, distance: '0.8 km', photo: 'https://i.imgur.com/VzUG6Vg.png', status: 'online', isVerified: true, isPremium: true, personality: 'Sedutora e misteriosa' },
    { id: 'top-2', name: 'Rafaela', age: 25, distance: '1.2 km', photo: 'https://i.imgur.com/PPSiXWT.png', status: 'online', isVerified: true, isPremium: true, personality: 'Ousada e provocante' },
    { id: 'top-3', name: 'Bianca', age: 22, distance: '0.5 km', photo: 'https://i.imgur.com/pEMHdkO.png', status: 'online', isVerified: true, isPremium: true, personality: 'Carinhosa e atenciosa' },
];

// PREMIUMS DA SEMANA
const PREMIUM_PROFILES: Profile[] = [
    { id: 'prem-1', name: 'Amanda', age: 24, distance: '2.1 km', photo: 'https://i.imgur.com/clFia7c.png', status: 'online', isVerified: true, isPremium: true, personality: 'Divertida e espontânea' },
    { id: 'prem-2', name: 'Letícia', age: 26, distance: '1.8 km', photo: 'https://i.imgur.com/1eIiPSk.png', status: 'online', isVerified: true, isPremium: true, personality: 'Elegante e sofisticada' },
    { id: 'prem-3', name: 'Júlia', age: 21, distance: '3.2 km', photo: 'https://i.imgur.com/LYifhD0.png', status: 'busy', isVerified: true, isPremium: true, personality: 'Romântica e sonhadora' },
    { id: 'prem-4', name: 'Carolina', age: 27, distance: '0.9 km', photo: 'https://i.imgur.com/NspydbW.png', status: 'online', isVerified: true, isPremium: true, personality: 'Intensa e apaixonada' },
    { id: 'prem-5', name: 'Beatriz', age: 23, distance: '2.5 km', photo: 'https://i.imgur.com/ZsTnqcw.png', status: 'online', isVerified: true, isPremium: true, personality: 'Aventureira e corajosa' },
    { id: 'prem-6', name: 'Fernanda', age: 25, distance: '1.4 km', photo: 'https://i.imgur.com/Z3tyI2W.png', status: 'online', isVerified: true, isPremium: true, personality: 'Sensual e envolvente' },
    { id: 'prem-7', name: 'Gabriela', age: 22, distance: '4.0 km', photo: 'https://i.imgur.com/KznB6kO.png', status: 'busy', isVerified: true, isPremium: true, personality: 'Tímida mas ousada' },
    { id: 'prem-8', name: 'Larissa', age: 24, distance: '1.1 km', photo: 'https://i.imgur.com/ReLgoKL.png', status: 'online', isVerified: true, isPremium: true, personality: 'Carismática e divertida' },
    { id: 'prem-9', name: 'Mariana', age: 26, distance: '2.8 km', photo: 'https://i.imgur.com/Q9gCCe6.png', status: 'online', isVerified: true, isPremium: true, personality: 'Madura e experiente' },
];

// OUTRAS BEM FALADAS NA SUA CIDADE
const OTHER_PROFILES: Profile[] = [
    { id: 'other-1', name: 'Priscila', age: 23, distance: '1.5 km', photo: 'https://i.imgur.com/4mS6R25.png', status: 'online', isVerified: true, isPremium: false, personality: 'Simpática e acolhedora' },
    { id: 'other-2', name: 'Tatiane', age: 25, distance: '2.3 km', photo: 'https://i.imgur.com/FDcqdK3.png', status: 'online', isVerified: false, isPremium: false, personality: 'Alegre e comunicativa' },
    { id: 'other-3', name: 'Sabrina', age: 21, distance: '0.7 km', photo: 'https://i.imgur.com/ZNmmtaj.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Jovem e cheia de energia' },
    { id: 'other-4', name: 'Viviane', age: 27, distance: '3.1 km', photo: 'https://i.imgur.com/tmMWmmW.png', status: 'online', isVerified: true, isPremium: false, personality: 'Determinada e focada' },
    { id: 'other-5', name: 'Daniela', age: 24, distance: '1.9 km', photo: 'https://i.imgur.com/PHZYZ0l.png', status: 'online', isVerified: false, isPremium: false, personality: 'Criativa e artística' },
    { id: 'other-6', name: 'Natália', age: 22, distance: '2.6 km', photo: 'https://i.imgur.com/EIfYapZ.png', status: 'online', isVerified: true, isPremium: false, personality: 'Esportiva e saudável' },
    { id: 'other-7', name: 'Renata', age: 26, distance: '0.4 km', photo: 'https://i.imgur.com/A0PWPkJ.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Intelectual e curiosa' },
    { id: 'other-8', name: 'Vanessa', age: 23, distance: '1.7 km', photo: 'https://i.imgur.com/MnFgMXr.png', status: 'online', isVerified: false, isPremium: false, personality: 'Misteriosa e intrigante' },
    { id: 'other-9', name: 'Patrícia', age: 25, distance: '3.5 km', photo: 'https://i.imgur.com/txZdT43.png', status: 'online', isVerified: true, isPremium: false, personality: 'Carinhosa e atenciosa' },
    { id: 'other-10', name: 'Jéssica', age: 21, distance: '2.0 km', photo: 'https://i.imgur.com/IH8nVlm.png', status: 'online', isVerified: false, isPremium: false, personality: 'Extrovertida e festeira' },
    { id: 'other-11', name: 'Aline', age: 24, distance: '1.3 km', photo: 'https://i.imgur.com/RlJQvBX.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Serena e tranquila' },
    { id: 'other-12', name: 'Michele', age: 26, distance: '4.2 km', photo: 'https://i.imgur.com/ERtSofR.png', status: 'online', isVerified: true, isPremium: false, personality: 'Sofisticada e elegante' },
    { id: 'other-13', name: 'Cristina', age: 22, distance: '0.9 km', photo: 'https://i.imgur.com/OMfeMpA.png', status: 'online', isVerified: false, isPremium: false, personality: 'Doce e meiga' },
    { id: 'other-14', name: 'Luciana', age: 27, distance: '2.4 km', photo: 'https://i.imgur.com/HslhG74.png', status: 'online', isVerified: true, isPremium: false, personality: 'Madura e experiente' },
    { id: 'other-15', name: 'Karina', age: 23, distance: '1.6 km', photo: 'https://i.imgur.com/E07o6YO.png', status: 'busy', isVerified: false, isPremium: false, personality: 'Divertida e brincalhona' },
    { id: 'other-16', name: 'Eduarda', age: 25, distance: '3.8 km', photo: 'https://i.imgur.com/9VjFwNZ.png', status: 'online', isVerified: true, isPremium: false, personality: 'Apaixonante e cativante' },
    { id: 'other-17', name: 'Flávia', age: 21, distance: '0.6 km', photo: 'https://i.imgur.com/buP1qyl.png', status: 'online', isVerified: true, isPremium: false, personality: 'Aventureira e destemida' },
    { id: 'other-18', name: 'Thais', age: 24, distance: '2.7 km', photo: 'https://i.imgur.com/bqtl4nr.png', status: 'online', isVerified: false, isPremium: false, personality: 'Sensível e emotiva' },
    { id: 'other-19', name: 'Camila', age: 26, distance: '1.0 km', photo: 'https://i.imgur.com/BZo5pVt.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Decidida e confiante' },
    { id: 'other-20', name: 'Raquel', age: 22, distance: '3.3 km', photo: 'https://i.imgur.com/ibAFkdA.png', status: 'online', isVerified: false, isPremium: false, personality: 'Romântica e sonhadora' },
    { id: 'other-21', name: 'Ingrid', age: 23, distance: '1.2 km', photo: 'https://i.imgur.com/tt2ai8i.png', status: 'online', isVerified: true, isPremium: false, personality: 'Charmosa e elegante' },
    { id: 'other-22', name: 'Monique', age: 25, distance: '2.9 km', photo: 'https://i.imgur.com/pmkMSrV.png', status: 'online', isVerified: true, isPremium: false, personality: 'Sexy e provocante' },
    { id: 'other-23', name: 'Simone', age: 27, distance: '0.3 km', photo: 'https://i.imgur.com/GUBEfPF.png', status: 'busy', isVerified: false, isPremium: false, personality: 'Prática e objetiva' },
    { id: 'other-24', name: 'Helena', age: 21, distance: '4.5 km', photo: 'https://i.imgur.com/iUufhKp.png', status: 'online', isVerified: true, isPremium: false, personality: 'Meiga e delicada' },
    { id: 'other-25', name: 'Paula', age: 24, distance: '1.8 km', photo: 'https://i.imgur.com/pRO2qT6.png', status: 'online', isVerified: false, isPremium: false, personality: 'Intensa e apaixonada' },
    { id: 'other-26', name: 'Sandra', age: 26, distance: '2.2 km', photo: 'https://i.imgur.com/nXhy5T6.png', status: 'online', isVerified: true, isPremium: false, personality: 'Carismática e envolvente' },
    { id: 'other-27', name: 'Débora', age: 22, distance: '3.6 km', photo: 'https://i.imgur.com/McEOVyQ.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Alegre e otimista' },
    { id: 'other-28', name: 'Rose', age: 23, distance: '0.8 km', photo: 'https://i.imgur.com/VX1xyd8.png', status: 'online', isVerified: false, isPremium: false, personality: 'Sedutora e misteriosa' },
    { id: 'other-29', name: 'Ana Clara', age: 25, distance: '1.5 km', photo: 'https://i.imgur.com/H1vUfTs.png', status: 'online', isVerified: true, isPremium: false, personality: 'Simpática e acolhedora' },
    { id: 'other-30', name: 'Luana', age: 21, distance: '2.1 km', photo: 'https://i.imgur.com/Dk09miC.png', status: 'online', isVerified: false, isPremium: false, personality: 'Jovem e atrevida' },
    { id: 'other-31', name: 'Carla', age: 24, distance: '3.0 km', photo: 'https://i.imgur.com/vZyEE62.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Determinada e forte' },
    { id: 'other-32', name: 'Elisa', age: 26, distance: '0.5 km', photo: 'https://i.imgur.com/NRqx2bp.png', status: 'online', isVerified: true, isPremium: false, personality: 'Elegante e refinada' },
    { id: 'other-33', name: 'Bruna', age: 22, distance: '1.9 km', photo: 'https://i.imgur.com/0qmbJ0F.png', status: 'online', isVerified: false, isPremium: false, personality: 'Espontânea e divertida' },
    { id: 'other-34', name: 'Cláudia', age: 27, distance: '4.1 km', photo: 'https://i.imgur.com/ndsA0k0.png', status: 'online', isVerified: true, isPremium: false, personality: 'Madura e sensual' },
    { id: 'other-35', name: 'Diana', age: 23, distance: '2.5 km', photo: 'https://i.imgur.com/uxkG6PL.png', status: 'busy', isVerified: false, isPremium: false, personality: 'Misteriosa e encantadora' },
    { id: 'other-36', name: 'Gisele', age: 25, distance: '1.4 km', photo: 'https://i.imgur.com/2ThCB4X.png', status: 'online', isVerified: true, isPremium: false, personality: 'Linda e carismática' },
    { id: 'other-37', name: 'Lívia', age: 21, distance: '3.4 km', photo: 'https://i.imgur.com/WHT54bP.png', status: 'online', isVerified: true, isPremium: false, personality: 'Alegre e comunicativa' },
    { id: 'other-38', name: 'Marina', age: 24, distance: '0.7 km', photo: 'https://i.imgur.com/61zUPSM.png', status: 'online', isVerified: false, isPremium: false, personality: 'Calma e tranquila' },
    { id: 'other-39', name: 'Sofia', age: 26, distance: '2.8 km', photo: 'https://i.imgur.com/JWH8rIg.png', status: 'busy', isVerified: true, isPremium: false, personality: 'Sofisticada e sexy' },
];

const SECTIONS: Section[] = [
    { title: '🔥 Top 3 da Cidade', icon: '👑', subtitle: 'As mais desejadas', profiles: TOP3_PROFILES },
    { title: '⭐ Premiums da Semana', icon: '💎', subtitle: 'Exclusivas VIP', profiles: PREMIUM_PROFILES },
    { title: '💋 Bem Faladas na Cidade', icon: '🔥', subtitle: 'Populares perto de você', profiles: OTHER_PROFILES.slice(0, 12) },
    { title: '✨ Novas por Aqui', icon: '⚡', subtitle: 'Acabaram de chegar', profiles: OTHER_PROFILES.slice(12, 24) },
    { title: '💕 Compatíveis com Você', icon: '❤️', subtitle: 'Seus matches', profiles: OTHER_PROFILES.slice(24, 39) },
];

/* ==================== MAIN APP ==================== */
function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
    const [autoChats, setAutoChats] = useState<AutoChat[]>([]);

    // Auto-start 2 chats when user enters
    useEffect(() => {
        const startAutoChats = async () => {
            // Select 2 random profiles
            const profile1 = SECTIONS[0].profiles[0]; // Ana Beatriz
            const profile2 = SECTIONS[1].profiles[1]; // Juliana from nearby

            // Start sessions for both
            const [session1, session2] = await Promise.all([
                startSessionAPI(profile1),
                startSessionAPI(profile2)
            ]);

            setAutoChats([
                {
                    profile: profile1,
                    sessionId: session1.sessionId,
                    messages: session1.messages,
                    unread: session1.messages.length
                },
                {
                    profile: profile2,
                    sessionId: session2.sessionId,
                    messages: session2.messages,
                    unread: session2.messages.length
                }
            ]);
        };

        // Delay to simulate natural behavior
        const timer = setTimeout(startAutoChats, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleStartChat = useCallback(async (profile: Profile) => {
        // Open chat modal immediately with loading state
        setActiveChat({ profile, messages: [], loading: true, sessionId: '', showPremiumButton: false, showPixButton: false });

        // Start new session with API
        const { sessionId, messages } = await startSessionAPI(profile);

        // Update with received messages and sessionId
        setActiveChat({
            profile,
            messages: messages.map(m => ({ role: 'assistant' as const, content: m })),
            loading: false,
            sessionId,
            showPremiumButton: false,
            showPixButton: false
        });
    }, []);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!activeChat || !activeChat.sessionId) return;

        // Add user message immediately
        const userMsg: ChatMessage = { role: 'user', content: message };
        setActiveChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, userMsg],
            loading: true
        } : null);

        // Get AI response from session API
        const response = await sendSessionMessageAPI(activeChat.sessionId, message);

        // Add AI response and update premium button state
        setActiveChat(prev => prev ? {
            ...prev,
            messages: [...prev.messages, { role: 'assistant', content: response.message }],
            loading: false,
            showPremiumButton: response.shouldShowPremiumButton || prev.showPremiumButton
        } : null);
    }, [activeChat]);

    const handlePremiumClick = useCallback(() => {
        // Show PIX checkout button when user clicks on Faxina Especial
        console.log('Faxina Especial clicked for session:', activeChat?.sessionId);
        setActiveChat(prev => prev ? {
            ...prev,
            showPixButton: true
        } : null);
    }, [activeChat]);

    const handlePixClick = useCallback(() => {
        // Open PIX checkout (you can replace this with your payment gateway)
        const pixKey = 'sua-chave-pix@email.com';

        // For now, show alert with PIX info
        alert(`🧹 Faxina Especial - R$70,00\n\n📱 Chave PIX: ${pixKey}\n\nApós o pagamento, envie o comprovante no chat!`);

        // You can also open a WhatsApp link or redirect to payment page:
        // window.open(`https://wa.me/5511999999999?text=Quero+a+faxina+especial`, '_blank');
    }, []);

    const handleCloseChat = useCallback(() => {
        setActiveChat(null);
    }, []);

    // ==================== GEOLOCALIZAÇÃO ====================
    const [showWelcomeToast, setShowWelcomeToast] = useState(false);
    const [userCity, setUserCity] = useState<string | null>(null);

    // Detectar localização ao carregar
    useEffect(() => {
        const initLocation = async () => {
            let location = getSavedLocation();
            if (!location) {
                location = await getUserLocation();
                saveUserLocation(location);
            }
            setUserCity(location.city);

            const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
            if (!hasSeenWelcome) {
                setShowWelcomeToast(true);
                sessionStorage.setItem('hasSeenWelcome', 'true');
                setTimeout(() => setShowWelcomeToast(false), 8000);
            }
        };
        initLocation();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#05050a' }}>
            <FuturisticBackground />

            {/* Toast de Boas-Vindas */}
            {showWelcomeToast && (
                <WelcomeToast
                    message="Bem-vindo ao HotMeet!"
                    city={userCity || undefined}
                    onClose={() => setShowWelcomeToast(false)}
                />
            )}

            <Header onToggleSidebar={() => setSidebarOpen(true)} />
            <FilterSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main style={{ paddingBottom: '80px' }}>
                {/* Hero */}
                <div style={{ padding: '30px 20px 20px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '10px', lineHeight: 1.2 }}>
                        Descubra <span className="text-gradient-hot">conexões</span>
                    </h1>
                    <p style={{ fontSize: '14px', color: '#B0B0C0', marginBottom: '20px' }}>
                        Milhares online perto de você.
                        <span style={{ color: '#00FF87', fontWeight: 700 }}> 1.247 agora!</span>
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div className="card-frame" style={{ padding: '10px 16px' }}>
                            <span className="text-gradient-hot" style={{ fontSize: '20px', fontWeight: 900 }}>50k+</span>
                            <span style={{ fontSize: '11px', color: '#6B6B80', marginLeft: '6px' }}>Perfis</span>
                        </div>
                        <div className="card-frame" style={{ padding: '10px 16px' }}>
                            <span className="text-gradient-gold" style={{ fontSize: '20px', fontWeight: 900 }}>12k</span>
                            <span style={{ fontSize: '11px', color: '#6B6B80', marginLeft: '6px' }}>Matches</span>
                        </div>
                        <div className="card-frame" style={{ padding: '10px 16px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#00FF87' }}>98%</span>
                            <span style={{ fontSize: '11px', color: '#6B6B80', marginLeft: '6px' }}>Satisfação</span>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                {SECTIONS.map((section, idx) => (
                    <HorizontalSection key={idx} section={section} onStartChat={handleStartChat} />
                ))}
            </main>

            {/* Auto-Chat Notifications */}
            {autoChats.length > 0 && !activeChat && (
                <div
                    className="auto-chat-container"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '16px',
                        left: 'auto',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        maxWidth: '320px',
                        width: 'calc(100% - 32px)'
                    }}>
                    {autoChats.map((chat, idx) => (
                        <div
                            key={idx}
                            className="auto-chat-notification"
                            onClick={() => {
                                setActiveChat({
                                    profile: chat.profile,
                                    messages: chat.messages.map(m => ({ role: 'assistant' as const, content: m })),
                                    loading: false,
                                    sessionId: chat.sessionId,
                                    showPremiumButton: false,
                                    showPixButton: false
                                });
                                setAutoChats(prev => prev.filter((_, i) => i !== idx));
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, rgba(255,45,85,0.2), rgba(139,92,246,0.2))',
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(255,45,85,0.4)',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                animation: 'slideIn 0.5s ease-out, neonPulse 2s infinite',
                                boxShadow: '0 8px 32px rgba(255,45,85,0.3)'
                            }}
                        >
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={chat.profile.photo}
                                    alt={chat.profile.name}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '14px',
                                    height: '14px',
                                    background: '#00FF87',
                                    borderRadius: '50%',
                                    border: '2px solid #08080C'
                                }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{chat.profile.name}</span>
                                    <span style={{
                                        background: '#FF2D55',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: '10px'
                                    }}>
                                        {chat.unread}
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#B0B0C0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {chat.messages[0] || 'Nova mensagem...'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Chat Modal */}
            {activeChat && (
                <ChatModal
                    chat={activeChat}
                    onClose={handleCloseChat}
                    onSendMessage={handleSendMessage}
                    onPremiumClick={handlePremiumClick}
                    onPixClick={handlePixClick}
                />
            )}
        </div>
    );
}

export default App;
