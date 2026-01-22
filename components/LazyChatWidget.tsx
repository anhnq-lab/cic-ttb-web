import React, { useState, useEffect, lazy, Suspense } from 'react';

const ChatWidget = lazy(() => import('./ChatWidget'));

interface LazyChatWidgetProps {
    externalTrigger: { message: string; timestamp: number } | null;
}

export const LazyChatWidget: React.FC<LazyChatWidgetProps> = ({ externalTrigger }) => {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Load ChatWidget after 3 seconds delay (non-critical component)
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Force load if triggered externally
    useEffect(() => {
        if (externalTrigger) {
            setShouldLoad(true);
        }
    }, [externalTrigger]);

    if (!shouldLoad) {
        return null; // Don't render anything until loaded
    }

    return (
        <Suspense fallback={null}>
            <ChatWidget externalTrigger={externalTrigger} />
        </Suspense>
    );
};
