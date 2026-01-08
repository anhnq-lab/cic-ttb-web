import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
    onAccept?: () => void;
    onDecline?: () => void;
}

const CONSENT_KEY = 'cookie-consent-status';

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consentStatus = localStorage.getItem(CONSENT_KEY);
        if (!consentStatus) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);

        // Enable tracking scripts
        enableTracking();
        onAccept?.();
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        setVisible(false);

        // Disable tracking
        disableTracking();
        onDecline?.();
    };

    const enableTracking = () => {
        // Enable Google Analytics / GTM
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
            });
        }
    };

    const disableTracking = () => {
        // Disable Google Analytics / GTM
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-gray-700 text-sm leading-relaxed">
                            <strong className="text-gray-900">🍪 Chúng tôi sử dụng cookies</strong> để cải thiện trải nghiệm của bạn.
                            Bằng cách tiếp tục sử dụng website, bạn đồng ý với{' '}
                            <a href="#" className="text-brand-blue hover:underline font-medium">Chính sách Cookie</a> của chúng tôi.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={handleDecline}
                            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Từ chối
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-5 py-2.5 text-sm font-bold text-white bg-brand-blue rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all"
                        >
                            Đồng ý tất cả
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper to check consent status
export const hasConsentedToCookies = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
};

export default CookieConsent;
