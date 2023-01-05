import React from 'react';
import WorkspaceControl from './workspace-control';
import { isMobile } from '@deriv/shared';

type TBotPreview = {
    id_ref: HTMLElement | React.ReactNode | null;
};

const is_mobile = isMobile();

const BotPreview = ({ id_ref }: TBotPreview) => {
    return (
        <div>
            <div
                className='load-strategy__preview-workspace-container'
                id={is_mobile ? 'load-strategy__blockly-container__mobile' : 'load-strategy__blockly-container'}
                ref={id_ref}
            >
                <WorkspaceControl />
            </div>
        </div>
    );
};

export default BotPreview;
