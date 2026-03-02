'use client';

import { useState, useEffect } from 'react';

export function useIsAndroid() {
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        const isAndroidUA = ua.includes('android');

        // Also check for Capacitor specifically if possible
        const isCapacitor = (window as any).Capacitor?.getPlatform() === 'android';

        setIsAndroid(isAndroidUA || isCapacitor);
    }, []);

    return isAndroid;
}
