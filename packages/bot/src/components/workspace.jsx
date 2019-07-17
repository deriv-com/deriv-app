import React from 'react';
import            '../assets/sass/scratch/_workspace.scss';
import            '../assets/sass/scratch/_toolbox.scss';
import            '../assets/sass/scratch/_flyout.scss';

const Workspace = () => (
    <React.Fragment>
        {/* temperaily download & upload button */}
        <button id='download'>Download</button>
        <input type='file' id='upload' />
        <div id='scratch_area' />
        <div id='scratch_div' />
    </React.Fragment>
);

export default Workspace;
