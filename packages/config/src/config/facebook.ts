import { registerAs } from '@nestjs/config';

export default registerAs('facebook', () => ({
    // Facebook OAuth Client ID
    clientId: process.env.FACEBOOK_CLIENT_ID,

    // Facebook OAuth Client Secret
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,

    // Callback URL for handling the OAuth response after authentication
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || `${process.env.API_BASE_URL}/api/auth/facebook/callback`
}));
