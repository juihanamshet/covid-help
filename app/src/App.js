import React, { useState } from 'react';
import AboutUs from './aboutUs.js';
import FindOffer from './findOffer.js';
import Auth from './Auth.js';
import { makeStyles} from '@material-ui/core/styles';
import { Toolbar, AppBar, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar:{
    boxShadow: 'none',
  },
  title: {
    flexGrow: 1,
  },
  tab: {
    color: 'black',
    "&:hover":{
      backgroundColor: 'transparent',
      color: 'grey',
      textDecoration: 'underline',
    }
  },
  appBarHeight: theme.mixins.toolbar
}));

const ABOUT_US = 0;
const FIND_OFFER = 1;
const AUTH = 2;

function App() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  var childpage;

  switch(page) {
    case ABOUT_US:
      childpage = (<AboutUs></AboutUs>);
      console.log('about us');
      break;
    case FIND_OFFER:
      childpage = (<FindOffer></FindOffer>);
      console.log('find & offer');
      break;
    case AUTH:
      childpage = (<Auth></Auth>);
      console.log('auth');
      break;
    default:
      childpage=(null);
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
              Project Student Relief
          </Typography>
          <Button
            className={classes.tab}
            onClick={() => setPage(0)}>
              About Us
          </Button>
          <Button
            className={classes.tab}
            onClick={() => setPage(1)}>
              Find & Offer
          </Button>
          <Button
            className={classes.tab}
            onClick={() => setPage(2)}>
              Sign In
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.appBarHeight}/>
      {childpage}
    </div>
  );
}

export default App;
