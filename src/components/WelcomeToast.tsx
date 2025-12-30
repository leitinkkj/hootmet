import React from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    city?: string;
    onClose: () => void;
}

const WelcomeToast: React.FC<ToastProps> = ({ message, city, onClose }) => {
    return (
        <div className="welcome-toast">
            <button className="toast-close" onClick={onClose} aria-label="Fechar">
                ✕
            </button>

            <div className="toast-icon">
                📍
            </div>

            <div className="toast-content">
                <h3 className="toast-title">Bem-vindo ao HotMeet!</h3>
                <p className="toast-message">
                    {city ? (
                        <>
                            Olá! Você é de <strong>{city}</strong> 🔥
                            <br />
                            <span className="toast-subtitle">Conecte-se com pessoas próximas de você</span>
                        </>
                    ) : (
                        message
                    )}
                </p>
            </div>
        </div>
    );
};

export default WelcomeToast;
