import React    from 'react';
import Flyout   from './flyout.jsx';
import               '../assets/sass/scratch/workspace.scss';
import               '../assets/sass/scratch/toolbox.scss';
import               '../assets/sass/scratch/flyout.scss';
import               '../assets/sass/scratch/toolbar.scss';

const Workspace = () => (
    <React.Fragment>
        {/* <div id='scratch_area' /> */}
        <div id='scratch_div'>
            <Flyout />
        </div>
    </React.Fragment>
);

export default Workspace;
