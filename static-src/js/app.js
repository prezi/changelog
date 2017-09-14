import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => (
    <MuiThemeProvider>
        <h1>ohai!</h1>
    </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
    document.getElementById('app')
);