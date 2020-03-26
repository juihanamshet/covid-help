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
            "&:hover": {
                color: '#eceff1',
                textDecoration: 'none',
            }
        },
        titleText:{
            color: 'white',
        },
        tab: {
            color: 'white',
            paddingRight: 15,
            fontWeight: 500,
            "&:hover": {
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
                <Link
                    className={classes.title}
                    to="/">
                    <Typography className={classes.titleText} variant="h5" >
                        Project Student Relief
                    </Typography>
                </Link>
                <Link
                    className={classes.tab}
                    to="/">
                    About Us
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