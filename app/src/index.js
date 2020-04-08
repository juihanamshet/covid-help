import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

import { MuiThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import * as serviceWorker from './serviceWorker';

let theme = createMuiTheme({
    palette: {
        primary: {
            main: '#6699ff',
            supaLight: "#e6eeff"
        },
        secondary: {
            main: '#ffa666',
        },
    },
});

theme = responsiveFontSizes(theme);

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
