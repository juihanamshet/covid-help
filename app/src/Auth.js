import React, { useEffect } from 'react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { useOktaAuth } from '@okta/okta-react';
import { Redirect } from 'react-router-dom';
import NavBar from './NavBar.js'
import config from './config';

const Auth = () => {
    const { authState } = useOktaAuth();


    useEffect(() => {
        const { pkce, issuer, clientId, scopes } = config.oidc;
        let configuration = {
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
            logo: '../public/home.png',
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
        };

        const widget = new OktaSignIn(configuration);

        widget.renderEl(
            { el: '#sign-in-widget' },
            () => {
            },
            (err) => {
                throw err;
            },
        );
        // on unmount, remove the widget
        return () => {
            widget.remove();
        }
    }, []);

    if (authState.isAuthenticated) {
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