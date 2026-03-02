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
                // Check current permissions
                let permStatus = await PushNotifications.checkPermissions();

                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive !== 'granted') {
                    console.log('User denied push permission');
                    return;
                }

                // Register with Apple / Google to receive token
                await PushNotifications.register();

                // On success, we get the token
                await PushNotifications.addListener('registration', async (response) => {
                    if (isRegistered) return;
                    isRegistered = true;
                    console.log('Push registration success, token: ' + response.value);
                    setToken(response.value);

                    // Send the token to your backend
                    try {
                        await fetch('/api/admin/push-tokens', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                restaurantId,
                                token: response.value
                            })
                        });
                    } catch (e) {
                        console.error('Error saving push token', e);
                    }
                });

                // Some issue with our setup and push will not work
                await PushNotifications.addListener('registrationError', (error: any) => {
                    console.error('Error on registration: ' + JSON.stringify(error));
                });

                // Show us the notification payload if the app is open on our device
                await PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Push received: ' + JSON.stringify(notification));
                });

                // Method called when tapping on a notification
                await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                    console.log('Push action performed: ' + JSON.stringify(notification));
                });

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
