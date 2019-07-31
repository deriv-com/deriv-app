import React                    from 'react';
import ReactDOM                 from 'react-dom';
import Button                   from 'deriv-components/lib/button'; // eslint-disable-line import/no-unresolved
import Label                    from 'deriv-components/lib/label'; // eslint-disable-line import/no-unresolved
import App                      from './app.jsx';
import { scratchWorkspaceInit } from './scratch';
import { oauthLogin }           from './services/api/appId';
import { getTokenList }         from './utils/tokenHelper';

ReactDOM.render(
    <App />,
    document.getElementById('root'),
    () => scratchWorkspaceInit('scratch_area', 'scratch_div')
);

// Import components
console.log ('Logger: ', Button , Label); // eslint-disable-line no-console

const loginCheck = () => {
    // if (endpoint()) return;
    if (getTokenList().length) {
        // window.location.pathname = `${window.location.pathname.replace(/\/+$/, '')}`;
    } else {
        // loadLang();
        oauthLogin(() => {
            // show loader
        });
    }
};

loginCheck();
