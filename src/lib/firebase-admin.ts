import * as admin from 'firebase-admin';

// Protect against multiple initializations in development
if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("Firebase Admin initialized successfully.");
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is not set. Push notifications will be silent.");
        }
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

export const firebaseAdmin = admin;

/**
 * Sends a push notification to an array of tokens
 */
export async function sendPushNotification(tokens: string[], title: string, body: string, data?: any) {
    if (!tokens || tokens.length === 0) return;
    if (!admin.apps.length) {
        console.warn("Cannot send push notification: Firebase Admin not initialized.");
        return;
    }

    try {
        const message = {
            notification: {
                title,
                body
            },
            data: data || {},
            tokens: tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`Push notification sent: ${response.successCount} successful, ${response.failureCount} failed.`);

        // Optional: Handle token cleanup if failure is due to unregistered tokens
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(`Failed to send to token ${tokens[idx]}:`, resp.error);
                    // e.g. if (resp.error.code === 'messaging/registration-token-not-registered') remover token from DB
                }
            });
        }
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}
