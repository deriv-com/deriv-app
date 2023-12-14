import React from 'react';
import { Text, Icon } from '@deriv/components';
import VolumeControl from './volume-control';
import PlaybackRateControl from './playback-rate-control';

type TVideoControls = {
    block_controls?: boolean;
    current_time?: number;
    is_playing?: boolean;
    is_mobile?: boolean;
    onRewind: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    dragStartHandler: (e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>) => void;
    onVolumeChange: (new_value: number) => void;
    onPlaybackRateChange: (new_value: number) => void;
    togglePlaying: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    video_duration?: number;
    show_controls?: boolean;
    volume?: number;
};

const VideoControls = React.forwardRef<HTMLDivElement, TVideoControls>(
    (
        {
            block_controls,
            current_time,
            is_playing,
            is_mobile,
            onRewind,
            dragStartHandler,
            onVolumeChange,
            onPlaybackRateChange,
            togglePlaying,
            show_controls,
            video_duration,
            volume,
        },
        ref
    ) => {
        const [is_drag_dot_visible, setIsDragDotVisible] = React.useState(false);

        const dummy_time = '00:00';

        const formatTime = (time?: number) => {
            if (time && !isNaN(time)) {
                const minutes = Math.floor(time / 60);
                const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
                const seconds = Math.floor(time % 60);
                const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
                return `${formatMinutes}:${formatSeconds}`;
            }
            return dummy_time;
        };

        return (
            <div
                className='player__controls__wrapper'
                style={{
                    opacity: `${show_controls ? '1' : '0'}`,
                    pointerEvents: `${show_controls ? 'auto' : 'none'}`,
                }}
            >
                <div
                    className='player__controls__progress-bar'
                    onClick={e => onRewind(e)}
                    onKeyDown={undefined}
                    onMouseOver={() => setIsDragDotVisible(true)}
                    onMouseLeave={() => setIsDragDotVisible(false)}
                >
                    <div className='player__controls__progress-bar__filled' ref={ref}>
                        {(is_mobile || is_drag_dot_visible) && (
                            <span
                                className='player__progress-dot'
                                onMouseDown={e => dragStartHandler(e)}
                                onTouchStart={e => dragStartHandler(e)}
                                onDragStart={() => false}
                            />
                        )}
                    </div>
                </div>
                <div
                    className='player__controls__bottom-bar'
                    onClick={e => e.stopPropagation()}
                    onKeyDown={undefined}
                    style={{ pointerEvents: `${block_controls ? 'none' : 'auto'}` }}
                >
                    <div className='player__controls__bottom-bar controls__left'>
                        <button onClick={e => togglePlaying(e)} className='player__controls__button'>
                            <Icon
                                icon={is_playing ? 'IcPause' : 'IcPlay'}
                                custom_color='var(--text-colored-background)'
                                height={18}
                                width={15}
                            />
                        </button>
                        <div className='player__controls__time-wrapper'>
                            <Text size='xxxs' line_height='s' color='colored-background'>
                                {formatTime(current_time)}
                                {' / '}
                            </Text>
                            <Text size='xxxs' line_height='s' color='colored-background'>
                                {formatTime(video_duration)}
                            </Text>
                        </div>
                    </div>
                    <div className='player__controls__bottom-bar controls__right'>
                        <VolumeControl onVolumeChange={onVolumeChange} volume={volume} is_mobile={is_mobile} />
                        <PlaybackRateControl onPlaybackRateChange={onPlaybackRateChange} is_mobile={is_mobile} />
                    </div>
                </div>
            </div>
        );
    }
);

VideoControls.displayName = 'VideoControls';
export default VideoControls;
