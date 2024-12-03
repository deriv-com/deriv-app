import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import { StandalonePauseFillIcon, StandalonePlayFillIcon, StandaloneXmarkRegularIcon } from '@deriv/quill-icons';

type TVideoOverlay = {
    onClick: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
    togglePlay: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
    is_ended?: boolean;
    is_mobile?: boolean;
    is_playing?: boolean;
    is_v2?: boolean;
    show_controls: boolean;
    onModalClose?: () => void;
};

const VideoOverlay = ({
    onClick,
    togglePlay,
    show_controls,
    is_ended,
    is_mobile,
    is_v2,
    is_playing,
    onModalClose,
}: TVideoOverlay) => {
    const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
        togglePlay(e as React.MouseEvent<HTMLDivElement>);
    };

    return (
        <div
            className={classNames('player__overlay', {
                'player__overlay--visible': is_ended || show_controls,
            })}
            onClick={onClick}
            onKeyDown={onClick}
        >
            {is_ended && (
                <Icon
                    icon='IcReplay'
                    custom_color='var(--border-normal-1)'
                    size={is_mobile ? 88 : 128}
                    className='player__overlay__icon'
                    data_testid='dt_player_overlay_icon'
                    onClick={handleClick}
                />
            )}
            {is_v2 && !is_ended && (
                <div onClick={show_controls ? handleClick : undefined}>
                    {is_playing ? (
                        <StandalonePauseFillIcon fill='#ffffff' iconSize='2xl' />
                    ) : (
                        <StandalonePlayFillIcon fill='#ffffff' iconSize='2xl' />
                    )}
                </div>
            )}
            {is_v2 && (
                <div onClick={onModalClose} className='modal-player__icon-close'>
                    <StandaloneXmarkRegularIcon fill='#ffffff' iconSize='md' />
                </div>
            )}
        </div>
    );
};

export default React.memo(VideoOverlay);
