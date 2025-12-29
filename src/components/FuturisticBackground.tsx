import React from 'react';

/**
 * ✨ Futuristic Animated Background Particles
 * Creates an immersive atmosphere with floating particles
 */
const FuturisticBackground: React.FC = () => {
    return (
        <>
            {/* Animated Gradient Orbs */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {/* Red Orb */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '15%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(255, 8, 68, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 20s ease-in-out infinite'
                }} />

                {/* Purple Orb */}
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    right: '20%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(70px)',
                    animation: 'float 25s ease-in-out infinite reverse'
                }} />

                {/* Cyan Orb */}
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    width: '450px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(65px)',
                    animation: 'float 30s ease-in-out infinite'
                }} />

                {/* Floating Particles */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
                            borderRadius: '50%',
                            animation: `particle ${Math.random() * 20 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                            boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, ${Math.random() * 0.5})`
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(50px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-50px, 50px) scale(0.9);
                    }
                }

                @keyframes particle {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default FuturisticBackground;
