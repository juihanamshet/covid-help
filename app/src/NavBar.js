import React, { useState } from 'react';
import { Toolbar, AppBar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';



const NavBar = () => {
    const { authState, authService } = useOktaAuth();

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
    const loginButton = !authState.isAuthenticated ?
        <Link className={classes.tab} to="/login">Log In</Link> :
        <Link className={classes.tab} to="/logout">Log Out</Link>;

    return (
        <AppBar className={classes.appBar} position="sticky" color="primary">
            <Toolbar>
                <Typography variant="h5" className={classes.title}>
                    Project Student Relief
              </Typography>
                <Link
                    className={classes.tab}
                    to="/">
                    About
              </Link>
                <Link
                    className={classes.tab}
                    to="offers">
                    Find & Offer
              </Link>
                {loginButton}
            </Toolbar>
        </AppBar>
    )

}

export default NavBar;