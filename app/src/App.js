import React from 'react';
import AllAppRoutes from './AllAppRoutes'
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    flexGrow: 1,
  },
}));

const App = () => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <AllAppRoutes></AllAppRoutes>
      </Router>
    </div >
  );
}

export default App;
