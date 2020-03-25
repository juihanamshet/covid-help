import { Security, LoginCallback, SecureRoute, useOktaAuth } from '@okta/okta-react';
import { Toolbar, AppBar, Typography, Button } from '@material-ui/core';
import AboutUs from './About/AboutUs.js';
import FindOffer from './FindOffer/FindOffer.js';
import Logout from './Logout'
import Auth from './Auth.js';
import React, { useState } from 'react';
import { useHistory, Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';



const AllAppRoutes = () => {
    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
        },
        appBar: {
            boxShadow: 'none',
        },
        title: {
            flexGrow: 1,
        },
        tab: {
            color: 'white',
            "&:hover": {
                backgroundColor: 'transparent',
                color: '#eceff1',
                textDecoration: 'underline',
            }
        }
    }));
    const classes = useStyles();

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
            <Route path='/implicit/callback' component={LoginCallback} />
        </Security >
    )

}

export default AllAppRoutes