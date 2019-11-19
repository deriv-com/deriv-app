import React        from 'react';
import Flyout       from './flyout.jsx';
import ScratchStore from '../stores/scratch-store';
import                   '../assets/sass/scratch/workspace.scss';
import                   '../assets/sass/scratch/toolbox.scss';

const Workspace = () => {
    const NotificationMessages = ScratchStore.instance.root_store.core.ui.notification_messages_ui || null;
    return (
        <React.Fragment>
            {/* <div id='scratch_area' /> */}
            <div id='scratch_div'>
                <div className='notificationsContainer'>
                    <NotificationMessages />
                </div>
                <Flyout />
            </div>
        </React.Fragment>
    );
};

export default Workspace;
