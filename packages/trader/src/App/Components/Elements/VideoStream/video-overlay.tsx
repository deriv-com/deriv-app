import React from 'react';
import { Icon } from '@deriv/components';

type TVideoOverlay = {
    onClick: (e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void;
    is_ended?: boolean;
    is_mobile?: boolean;
};

const VideoOverlay = ({ onClick, is_ended, is_mobile }: TVideoOverlay) => {
    return (
        <div
            className='player__overlay'
            style={{ opacity: `${is_ended ? '1' : '0'}` }}
            onClick={e => onClick(e)}
            onKeyDown={e => onClick(e)}
        >
            <Icon
                icon='IcReplay'
                custom_color='var(--border-normal-1)'
                size={is_mobile ? 88 : 128}
                className='player__overlay__icon'
            />
        </div>
    );
};

export default VideoOverlay;
