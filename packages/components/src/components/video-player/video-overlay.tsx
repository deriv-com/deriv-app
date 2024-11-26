import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';

type TVideoOverlay = {
    onClick: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
    is_ended?: boolean;
    is_mobile?: boolean;
    is_v2?: boolean;
};

const VideoOverlay = ({ onClick, is_ended, is_mobile, is_v2 }: TVideoOverlay) => (
    <div
        className={classNames('player__overlay', {
            'player__overlay--visible': is_ended,
        })}
        onClick={onClick}
        onKeyDown={onClick}
    >
        <Icon
            icon='IcReplay'
            custom_color='var(--border-normal-1)'
            size={is_mobile ? 88 : 128}
            className='player__overlay__icon'
            data_testid='dt_player_overlay_icon'
        />
        {is_v2 && (
            <div onClick={onClick} className='player__overlay__icon-close'>
                x
            </div>
        )}
    </div>
);

export default React.memo(VideoOverlay);
