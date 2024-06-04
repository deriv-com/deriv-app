import React, { RefObject } from 'react';
import WorkspaceControl from '../../../components/load-modal/workspace-control';

type TBotPreview = {
    id_ref: RefObject<HTMLDivElement>;
};

const BotPreview = ({ id_ref }: TBotPreview) => {
    return (
        <div className='load-strategy__preview-workspace-container' id='load-strategy__blockly-container' ref={id_ref}>
            <WorkspaceControl />
        </div>
    );
};

export default BotPreview;
