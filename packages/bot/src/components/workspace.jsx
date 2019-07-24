import React from 'react';
import Flyout from './flyout.jsx';
import            '../assets/sass/scratch/_workspace.scss';
import            '../assets/sass/scratch/_toolbox.scss';
import            '../assets/sass/scratch/_flyout.scss';

const Workspace = () => (
    <React.Fragment>
        <div id='scratch_area' />
        <div id='scratch_div' />
        <Flyout />
    </React.Fragment>
);

export default Workspace;
