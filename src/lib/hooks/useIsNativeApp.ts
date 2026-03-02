'use client';

import { useState, useEffect } from 'react';

export function useIsNativeApp() {
    const [isNativeApp, setIsNativeApp] = useState(false);

    useEffect(() => {
        // Check if Capacitor is available and reports as native platform (iOS/Android)
        // Capacitor injects `window.Capacitor.isNativePlatform()` when running natively.
        const isNative = typeof window !== 'undefined' &&
            (window as any).Capacitor?.isNativePlatform?.() === true;

        setIsNativeApp(isNative);
    }, []);

    return isNativeApp;
}
