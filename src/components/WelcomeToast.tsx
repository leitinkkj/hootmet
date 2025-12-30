import React from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    city?: string;
    onClose: () => void;
    profileName?: string;
    profilePhoto?: string;
    profileAge?: number;
}

const WelcomeToast: React.FC<ToastProps> = ({
    city,
    onClose,
    profileName = "Valentina",
    profilePhoto,
    profileAge = 23
}) => {
    const cityText = city && city !== 'sua cidade' ? city : null;

    return (
        <div className="welcome-toast profile-toast">
            <button className="toast-close" onClick={onClose} aria-label="Fechar">
                ✕
            </button>

            {profilePhoto && (
                <div className="toast-profile-photo">
                    <img src={profilePhoto} alt={profileName} />
                    <span className="online-dot"></span>
                </div>
            )}

            <div className="toast-content">
                {cityText ? (
                    <>
                        <p className="toast-greeting">
                            Oi! Você é de <strong>{cityText}</strong>? 😍
                        </p>
                        <p className="toast-intro">
                            Sou a <strong>{profileName}</strong>, {profileAge} anos
                        </p>
                        <p className="toast-cta">
                            Vem conversar comigo! 💕
                        </p>
                    </>
                ) : (
                    <>
                        <p className="toast-greeting">
                            Oi! Bem-vindo ao HotMeet! 😍
                        </p>
                        <p className="toast-intro">
                            Sou a <strong>{profileName}</strong>, {profileAge} anos
                        </p>
                        <p className="toast-cta">
                            Conecte-se com pessoas incríveis! 💕
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default WelcomeToast;
