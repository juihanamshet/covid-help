require('dotenv').config()
const REACT_APP_CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REACT_APP_ISSUER = process.env.REACT_APP_ISSUER || 'https://{oktaURL}.okta.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;

export default {
    oidc: {
        clientId: REACT_APP_CLIENT_ID,
        issuer: REACT_APP_ISSUER,
        redirectUri: 'http://localhost:8080/implicit/callback',
        scopes: ['openid', 'profile', 'email'],
        pkce: true,
        disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    },
};