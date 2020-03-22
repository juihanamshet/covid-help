import React, { useEffect } from 'react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { useOktaAuth } from '@okta/okta-react';
import { Redirect } from 'react-router-dom';
import NavBar from './NavBar.js'



import config from './config';

const Auth = () => {
    const { authState, authService } = useOktaAuth();


    useEffect(() => {
        const { pkce, issuer, clientId, redirectUri, scopes } = config.oidc;
        const widget = new OktaSignIn({
            /**
             * Note: when using the Sign-In Widget for an OIDC flow, it still
             * needs to be configured with the base URL for your Okta Org. Here
             * we derive it from the given issuer for convenience.
             */
            baseUrl: process.env.REACT_APP_BASEURL,
            clientId,
            redirectUri: "http://localhost:3000/implicit/callback/",
            getAccessToken: true,

            // Return an ID token from the authorization server
            getIdToken: true,
            features: {
                registration: true
            },
            // logo: '../public/logo192.png',
            i18n: {
                en: {
                    'primaryauth.title': 'Sign in',
                },
            },
            authParams: {
                pkce,
                issuer,
                display: 'page',
                scopes,
            },
        });

        widget.renderEl(
            { el: '#sign-in-widget' },
            () => {
                /**
                 * In this flow, the success handler will not be called beacuse we redirect
                 * to the Okta org for the authentication workflow.
                 */
            },
            (err) => {
                throw err;
            },
        );
    }, []);

    if (authState.isAuthenticated) {
        // authService.logout("/")
        return (<Redirect to="/offers"></Redirect>)
    }

    return (
        <div>
            <NavBar></NavBar>
            <div id="sign-in-widget" />
        </div>
    );
};
export default Auth;