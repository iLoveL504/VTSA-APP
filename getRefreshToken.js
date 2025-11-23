// getRefreshToken.js - Run this once locally
import { google } from 'googleapis';
import readline from 'readline';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost'
);

// Generate consent page URL
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send']
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
    rl.close();

    oauth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error getting token:', err);
            return;
        }
        console.log('Refresh Token:', token.refresh_token);
        console.log('Full tokens:', token);
    });
});