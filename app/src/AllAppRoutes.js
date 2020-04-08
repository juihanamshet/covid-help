import React from 'react';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import AboutUs from './About/AboutUs.js';
import FindOffer from './FindOffer/FindOffer.js';
import Logout from './Logout'
import Auth from './Auth.js';
import User from './User/User.js'
import { useHistory, Route } from 'react-router-dom';



const AllAppRoutes = () => {
    const history = useHistory();
    const onAuthRequired = () => {
        history.push('/login');
    };

    const config = {
        issuer: 'https://dev-937142.okta.com/oauth2/default',
        redirectUri: window.location.origin + '/implicit/callback',
        clientId: '0oa45qus51SlHZNDA4x6',
        pkce: true,
        onAuthRequired: onAuthRequired
    };

    return (
        <Security {...config}>
            <Route path='/' exact={true} component={AboutUs} />
            <SecureRoute path='/offers' exact={true} component={FindOffer} />
            <Route path='/login' exact={true} component={Auth} />
            <SecureRoute path='/logout' exact={true} component={Logout} />
            <SecureRoute path='/user' exact={true} component={User}/>
            <Route path='/implicit/callback' component={LoginCallback} />
        </Security >
    )

}

export default AllAppRoutes