import React  from 'react';
import Flyout from './flyout.jsx';
import             '../assets/sass/scratch/workspace.scss';
import             '../assets/sass/scratch/toolbox.scss';
import             '../assets/sass/scratch/flyout.scss';

const Workspace = () => (
    <React.Fragment>
        <div id='scratch_area' />
        <div id='scratch_div' />
        <Flyout />
    </React.Fragment>
);

export default Workspace;
