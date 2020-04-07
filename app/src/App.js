import React from 'react';
import AllAppRoutes from './AllAppRoutes'
import { makeStyles } from '@material-ui/core/styles';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Security, LoginCallback, SecureRoute, useOktaAuth } from '@okta/okta-react';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
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

const config = {
  issuer: 'https://dev-937142.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '0oa45qus51SlHZNDA4x6',
  pkce: true,

};

const App = () => {

  const classes = useStyles();

  // const { authState } = useOktaAuth;



  const loginButton = <Link className={classes.tab} to="/login">Log In</Link>;

  // authState.isAuthenticated ?
  //   <Link className={classes.tab} to="/login">Log In</Link> :
  //   <Link className={classes.tab} to="/logout">Log Out</Link>;


  return (
    <div className={classes.root}>
      <Router>
        <AllAppRoutes></AllAppRoutes>
      </Router>
    </div >
  );
}

export default App;
