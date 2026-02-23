import Stripe from 'stripe';

// Clean the key from ANY whitespace or hidden characters
// Aggressive cleanup: remove ANY character that isn't a letter, number, or underscore
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.replace(/[^a-zA-Z0-9_]/g, '');

if (!stripeSecretKey) {
    console.warn('WARNING: STRIPE_SECRET_KEY is not defined.');
} else {
    console.log(`Stripe Data - Prefix: ${stripeSecretKey.substring(0, 8)}, Suffix: ${stripeSecretKey.substring(stripeSecretKey.length - 4)}, Total Length: ${stripeSecretKey.length}`);
}

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, {
        // Let Stripe use the account's default version to avoid 'clover' mismatch issues
        typescript: true,
    })
    : null as any;
