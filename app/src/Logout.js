import React from 'react';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { useOktaAuth } from '@okta/okta-react';
import { Redirect } from 'react-router-dom';


const Logout = () => {
    const { authService } = useOktaAuth();
    authService.logout()
    return (
        <Redirect to="/"></Redirect>
    )
}

export default Logout