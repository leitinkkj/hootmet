import React, { useState } from 'react';
import { Search, Bell, User, Menu, Flame, Crown, Settings } from 'lucide-react';

const Header = ({
    user = { name: 'João', notifications: 3, isPremium: true },
    onToggleSidebar,
}) => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-glass border-b border-white/5 safe-area-top">
            <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">

                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF2D55] via-[#FF6B35] to-[#E91E8C] flex items-center justify-center shadow-lg shadow-[#FF3D81]/30">
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-black text-gradient-hot">HotMeet</span>
                        </div>
                    </div>
                </div>

                {/* Center: Search - Desktop */}
                <div className="hidden md:flex flex-1 max-w-lg mx-6">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, cidade..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3D81]/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Mobile Search */}
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="md:hidden p-2 rounded-xl hover:bg-white/5 active:bg-white/10"
                    >
                        <Search className="w-5 h-5 text-gray-300" />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-white/5 active:bg-white/10">
                        <Bell className="w-5 h-5 text-gray-300" />
                        {user.notifications > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF2D55] rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                                {user.notifications}
                            </span>
                        )}
                    </button>

                    {/* Settings */}
                    <button className="hidden sm:flex p-2 rounded-xl hover:bg-white/5 active:bg-white/10">
                        <Settings className="w-5 h-5 text-gray-300" />
                    </button>

                    {/* Profile */}
                    <button className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-white/5 active:bg-white/10">
                        <div className="relative">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E91E8C] flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            {user.isPremium && (
                                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-[#FFD700] to-[#FF6B35] rounded-full flex items-center justify-center">
                                    <Crown className="w-2 h-2 text-black" />
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Search Expanded */}
            {showSearch && (
                <div className="md:hidden px-3 pb-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3D81]/50"
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
