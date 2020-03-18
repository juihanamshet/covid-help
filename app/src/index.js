import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { brown, grey} from '@material-ui/core/colors';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: brown[50]
        },
        secondary: {
            main: grey[300]
        }
    },
});
// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
