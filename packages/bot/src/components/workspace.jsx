import React from 'react';
import Toolbar from './toolbar.jsx';
import '../assets/sass/scratch/_workspace.scss';
import '../assets/sass/scratch/_toolbox.scss';
import '../assets/sass/scratch/_flyout.scss';
import '../assets/sass/scratch/_toolbar.scss';
import '../assets/sass/scratch/_panel.scss';

const Workspace = () => (
    <React.Fragment>
        <Toolbar />
        <div id='scratch_area' />
        <div id='scratch_div' />
    </React.Fragment>
);

export default Workspace;
