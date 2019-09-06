import React            from 'react';
import Workspace        from './workspace.jsx';
import LoadModal        from './modal/load-modal.jsx';
import SaveModal        from './modal/save-modal.jsx';
import                       '../assets/sass/bot.scss';

const Bot = () => (
    <React.Fragment>
        <Workspace />
        <LoadModal />
        <SaveModal />
    </React.Fragment>
);

export default Bot;
