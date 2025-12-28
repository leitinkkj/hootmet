import React from 'react';
import { MessageCircle, MapPin, Crown, CheckCircle } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

const ProfileCard = ({
    profile = {},
    onChat,
    onView,
    index = 0,
}) => {
    const { name, age, distance, photo, status, isVerified, isPremium } = profile;

    return (
        <div
            className="relative group cursor-pointer card-premium flex-shrink-0"
            onClick={() => onView?.(profile)}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="relative w-[160px] sm:w-[180px] md:w-[200px] h-[240px] sm:h-[270px] md:h-[300px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151520]">

                {/* Photo */}
                <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3D81]/0 via-transparent to-[#FF6B35]/0 group-hover:from-[#FF3D81]/10 group-hover:to-[#FF6B35]/10 transition-all duration-500" />

                {/* Top Badges */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-start z-10">
                    {/* Premium Badge */}
                    {isPremium && (
                        <div className="bg-gradient-to-r from-[#FFD700] to-[#FF6B35] rounded-full p-1 sm:p-1.5 shadow-lg">
                            <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black" />
                        </div>
                    )}

                    {/* Status */}
                    <div className="ml-auto bg-black/60 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
                        <StatusIndicator status={status} size="sm" />
                        {status === 'online' && (
                            <span className="text-[9px] sm:text-[10px] text-[#00FF87] font-semibold hidden sm:inline">Online</span>
                        )}
                    </div>
                </div>

                {/* Verified Badge */}
                {isVerified && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                        <div className="bg-[#00D4FF]/90 backdrop-blur-sm rounded-full p-1">
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                    </div>
                )}

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 truncate">
                        {name}, {age}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
                        <MapPin className="w-3 h-3 text-[#FF6B35]" />
                        <span>{distance}</span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onChat?.(profile); }}
                        className="w-full btn-premium py-2 sm:py-2.5 px-3 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center justify-center gap-1.5"
                    >
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Conversar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
