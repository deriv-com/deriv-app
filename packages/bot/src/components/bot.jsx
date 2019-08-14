import React from 'react';
import LoadModal from './modal/load-modal.jsx';
import SaveModal from './modal/save-modal.jsx';
import Workspace from './workspace.jsx';
import '../assets/sass/_bot.scss';

const Bot = () => (
    <React.Fragment>
        <Workspace />
        <LoadModal />
        <SaveModal />
    </React.Fragment>
);

export default Bot;
