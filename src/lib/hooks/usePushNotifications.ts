'use client';

import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { useIsNativeApp } from './useIsNativeApp';

export function usePushNotifications(restaurantId?: string) {
    const isNativeApp = useIsNativeApp();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Only run on native apps where we have a restaurant context (likely the dashboard/admin)
        if (!isNativeApp || !restaurantId) return;

        let isRegistered = false;

        const registerPush = async () => {
            try {
                // 1. Add listeners FIRST
                await PushNotifications.addListener('registration', async (response) => {
                    if (isRegistered) return;
                    isRegistered = true;
                    console.log('Push registration success, token: ' + response.value);
                    setToken(response.value);

                    // Send the token to your backend
                    try {
                        const res = await fetch('/api/admin/push-tokens', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                restaurantId,
                                token: response.value
                            })
                        });
                        console.log('Token sync status:', res.status);
                    } catch (e) {
                        console.error('Error saving push token', e);
                    }
                });

                await PushNotifications.addListener('registrationError', (error: any) => {
                    console.error('Error on registration: ' + JSON.stringify(error));
                });

                await PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Push received: ' + JSON.stringify(notification));
                });

                await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                    console.log('Push action performed: ' + JSON.stringify(notification));
                });

                // 2. Check current permissions
                let permStatus = await PushNotifications.checkPermissions();
                console.log('Initial push permission status:', permStatus.receive);

                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                    console.log('Requested push permission status:', permStatus.receive);
                }

                if (permStatus.receive !== 'granted') {
                    console.log('User denied push permission or permission not granted');
                    return;
                }

                // 3. Register with Apple / Google to receive token
                console.log('Calling PushNotifications.register()...');
                await PushNotifications.register();

            } catch (error) {
                console.error("Error setting up push notifications:", error);
            }
        };

        registerPush();

        return () => {
            if (isNativeApp) {
                PushNotifications.removeAllListeners();
            }
        };
    }, [isNativeApp, restaurantId]);

    return { token };
}
