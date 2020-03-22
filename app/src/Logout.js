import React, { useEffect } from 'react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { useOktaAuth } from '@okta/okta-react';
import { Redirect } from 'react-router-dom';
import NavBar from './NavBar.js'



import config from './config';

const Logout = () => {
    const { authService } = useOktaAuth();
    authService.logout()
    return (
        <Redirect to="/"></Redirect>
    )
}

export default Logout