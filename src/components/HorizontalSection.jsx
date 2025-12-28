import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';

const HorizontalSection = ({
    title,
    icon,
    subtitle,
    profiles = [],
    onChat,
    onViewProfile,
}) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (dir) => {
        if (scrollRef.current) {
            const amount = window.innerWidth < 640 ? 300 : 450;
            scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative mb-6 sm:mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{icon}</span>
                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{title}</h2>
                        {subtitle && <p className="text-xs sm:text-sm text-gray-400">{subtitle}</p>}
                    </div>
                </div>

                {/* Nav Arrows - Desktop */}
                <div className="hidden sm:flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${canScrollLeft ? 'hover:bg-white/10 hover:border-[#FF3D81]/50' : 'opacity-30 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${canScrollRight ? 'hover:bg-white/10 hover:border-[#FF3D81]/50' : 'opacity-30 cursor-not-allowed'
                            }`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Cards Container */}
            <div className="relative">
                {/* Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#05050A] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#05050A] to-transparent z-10 pointer-events-none" />

                {/* Scrollable */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 py-2 snap-x snap-mandatory sm:snap-none"
                >
                    {profiles.map((profile, idx) => (
                        <div key={profile.id} className="snap-start">
                            <ProfileCard
                                profile={profile}
                                index={idx}
                                onChat={onChat}
                                onView={onViewProfile}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HorizontalSection;
