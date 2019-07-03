import React                    from 'react';
import ReactDOM                 from 'react-dom';
import App                      from './app.jsx';
import { scratchWorkspaceInit } from './scratch';
import { oauthLogin }           from './services/api/appId';
import { getTokenList }         from './utils/tokenHelper';

ReactDOM.render(
    <App />,
    document.getElementById('root'),
    () => scratchWorkspaceInit('scratch_area', 'scratch_div')
);

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
