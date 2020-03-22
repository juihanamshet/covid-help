import React, { useState } from 'react';
import AboutUs from './About/AboutUs.js';
import FindOffer from './FindOffer/FindOffer.js';
import Auth from './Auth.js';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, AppBar, Typography, Button } from '@material-ui/core';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';

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

const ABOUT_US = 0;
const FIND_OFFER = 1;
const AUTH = 2;
const config = {
  issuer: 'https://dev-937142.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/',
  clientId: '0oa45qus51SlHZNDA4x6',
  pkce: true
};

function App() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  var childpage;

  switch (page) {
    case ABOUT_US:
      // childpage = (<AboutUs></AboutUs>);
      childpage = (<Route path='/' exact={true} component={AboutUs} />);
      console.log('about us');
      break;
    case FIND_OFFER:
      // childpage = (<FindOffer></FindOffer>);
      childpage = (<SecureRoute path='/offers' exact={true} component={FindOffer} />);

      console.log('find & offer');
      break;
    case AUTH:
      // childpage = (<Auth></Auth>);
      childpage = (<Route path='/login' exact={true} component={Auth} />);
      console.log('auth');
      break;
    default:
      childpage = (null);
  }

  return (

    <div className={classes.root}>
      <Router>
        <Security {...config}>
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
              <Link
                className={classes.tab}
                to="/login">
                Sign In
                </Link>
            </Toolbar>
          </AppBar>
          <Route path='/' exact={true} component={AboutUs} />
          <SecureRoute path='/offers' exact={true} component={FindOffer} />
          <Route path='/login' exact={true} component={Auth} />
          {/* {childpage} */}
        </Security>
      </Router>
    </div>
  );
}

export default App;
