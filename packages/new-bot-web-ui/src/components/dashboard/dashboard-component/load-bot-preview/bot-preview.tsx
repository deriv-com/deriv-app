import React from 'react';
import WorkspaceControl from './workspace-control';

type TBotPreview = {
    id_ref: HTMLElement | React.ReactNode | null;
};

const BotPreview = ({ id_ref }: TBotPreview) => {
    return (
        <div className='load-strategy__preview-workspace-container' id='load-strategy__blockly-container' ref={id_ref}>
            <WorkspaceControl />
        </div>
    );
};

export default BotPreview;
