import React from 'react';
import WorkspaceControl from './workspace-control';

const BotPreview = ({ id_ref }) => {
    return (
        <div>
            <div
                className='load-strategy__preview-workspace-container'
                id='load-strategy__blockly-container'
                ref={id_ref}
            >
                <WorkspaceControl />
            </div>
        </div>
    );
};

export default BotPreview;
