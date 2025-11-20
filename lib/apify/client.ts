import { ApifyClient } from 'apify-client';

if (!process.env.APIFY_API_TOKEN) {
    console.warn('APIFY_API_TOKEN is not set. Apify client will not work correctly.');
}

export const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});
