import React    from 'react';
import Flyout   from './flyout.jsx';
import Toolbar  from './toolbar.jsx';
import               '../assets/sass/scratch/workspace.scss';
import               '../assets/sass/scratch/toolbox.scss';
import               '../assets/sass/scratch/flyout.scss';

const Workspace = () => (
    <React.Fragment>
        <Toolbar />
        <div id='scratch_area' />
        <div id='scratch_div'>
            <Flyout />
        </div>
    </React.Fragment>
);

export default Workspace;
