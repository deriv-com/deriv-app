import React                from 'react';
import Flyout               from './flyout.jsx';
import NotificationMessages from './notification-messages.jsx';
import                           '../assets/sass/scratch/workspace.scss';
import                           '../assets/sass/scratch/toolbox.scss';

const Workspace = () => (
    <React.Fragment>
        {/* <div id='scratch_area' /> */}
        <div id='scratch_div'>
            <NotificationMessages />
            <Flyout />
        </div>
    </React.Fragment>
);

export default Workspace;
