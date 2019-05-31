import React                    from 'react';
import ReactDOM                 from 'react-dom';
import App                      from './app.jsx';
import { scratchWorkspaceInit } from './scratch';

ReactDOM.render(
    <App />,
    document.getElementById('root'),
    () => scratchWorkspaceInit('scratch_area', 'scratch_div')
);

