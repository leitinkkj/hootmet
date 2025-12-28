import React, { useState } from 'react';
import { MapPin, Calendar, Heart, Sparkles, X, Sliders } from 'lucide-react';

const FilterSidebar = ({ isOpen, onClose, onFilterChange }) => {
    const [distance, setDistance] = useState(25);
    const [ageRange, setAgeRange] = useState([18, 35]);
    const [selected, setSelected] = useState([]);

    const interests = [
        { id: 'adventure', label: '🏔️ Aventura' },
        { id: 'music', label: '🎵 Música' },
        { id: 'fitness', label: '💪 Fitness' },
        { id: 'travel', label: '✈️ Viagens' },
        { id: 'food', label: '🍕 Gastronomia' },
        { id: 'movies', label: '🎬 Cinema' },
        { id: 'games', label: '🎮 Games' },
        { id: 'art', label: '🎨 Arte' },
        { id: 'party', label: '🎉 Festas' },
        { id: 'beach', label: '🏖️ Praia' },
    ];

    const toggle = (id) => setSelected(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 sm:w-80 bg-[#0A0A12] border-r border-white/5
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen lg:h-auto overflow-hidden
      `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF3D81] to-[#8B5CF6] flex items-center justify-center">
                            <Sliders className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold">Filtros</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Distance */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                            <MapPin className="w-4 h-4 text-[#FF6B35]" />
                            Distância
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={distance}
                            onChange={(e) => setDistance(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF3D81]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>1 km</span>
                            <span className="text-[#FF3D81] font-bold">{distance} km</span>
                            <span>100 km</span>
                        </div>
                    </div>

                    {/* Age */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                            <Calendar className="w-4 h-4 text-[#E91E8C]" />
                            Idade
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="18"
                                max="99"
                                value={ageRange[0]}
                                onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                                className="w-16 bg-white/5 border border-white/10 rounded-lg py-2 px-2 text-center text-sm focus:outline-none focus:border-[#FF3D81]/50"
                            />
                            <span className="text-gray-500">até</span>
                            <input
                                type="number"
                                min="18"
                                max="99"
                                value={ageRange[1]}
                                onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                                className="w-16 bg-white/5 border border-white/10 rounded-lg py-2 px-2 text-center text-sm focus:outline-none focus:border-[#FF3D81]/50"
                            />
                        </div>
                    </div>

                    {/* Interests */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                            <Heart className="w-4 h-4 text-[#FF2D55]" />
                            Interesses
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {interests.map((i) => (
                                <button
                                    key={i.id}
                                    onClick={() => toggle(i.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selected.includes(i.id)
                                            ? 'bg-gradient-to-r from-[#FF3D81] to-[#FF6B35] text-white shadow-lg shadow-[#FF3D81]/30'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    {i.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Apply Button */}
                <div className="p-4 border-t border-white/5 safe-area-bottom">
                    <button
                        onClick={() => onFilterChange?.({ distance, ageRange, interests: selected })}
                        className="w-full btn-premium py-3 rounded-xl font-bold text-white"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;
