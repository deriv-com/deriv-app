import React from 'react';
import { Text, Icon } from '@deriv/components';
import { formatDurationTime } from '@deriv/shared';
import VolumeControl from './volume-control';
import PlaybackRateControl from './playback-rate-control';

type TVideoControls = {
    block_controls?: boolean;
    current_time?: number;
    dragStartHandler: (e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => void;
    is_playing?: boolean;
    is_mobile?: boolean;
    onRewind: (e: React.MouseEvent<HTMLDivElement>) => void;
    onVolumeChange: (new_value: number) => void;
    onPlaybackRateChange: (new_value: number) => void;
    show_controls?: boolean;
    togglePlaying: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void;
    toggleMute: (new_value: boolean) => void;
    video_duration?: number;
    volume?: number;
};

const VideoControls = React.forwardRef<HTMLDivElement, TVideoControls>(
    (
        {
            block_controls,
            current_time,
            dragStartHandler,
            is_playing,
            is_mobile,
            onRewind,
            onVolumeChange,
            onPlaybackRateChange,
            show_controls,
            togglePlaying,
            toggleMute,
            video_duration,
            volume,
        },
        ref
    ) => {
        const [is_drag_dot_visible, setIsDragDotVisible] = React.useState(false);

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
                    onClick={onRewind}
                    onKeyDown={undefined}
                    onMouseOver={() => setIsDragDotVisible(true)}
                    onMouseLeave={() => setIsDragDotVisible(false)}
                >
                    <div className='player__controls__progress-bar__filled' ref={ref}>
                        {(is_mobile || is_drag_dot_visible) && (
                            <span
                                className='player__progress-dot'
                                onMouseDown={dragStartHandler}
                                onTouchStart={dragStartHandler}
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
                        <button onClick={togglePlaying} className='player__controls__button'>
                            <Icon
                                icon={is_playing ? 'IcPause' : 'IcPlay'}
                                custom_color='var(--text-colored-background)'
                                height={18}
                                width={15}
                            />
                        </button>
                        <div className='player__controls__time-wrapper'>
                            <Text size='xxxs' line_height='s' color='colored-background'>
                                {formatDurationTime(current_time)}
                                {' / '}
                                {formatDurationTime(video_duration)}
                            </Text>
                        </div>
                    </div>
                    <div className='player__controls__bottom-bar controls__right'>
                        <VolumeControl
                            onVolumeChange={onVolumeChange}
                            volume={volume}
                            is_mobile={is_mobile}
                            toggleMute={toggleMute}
                        />
                        <PlaybackRateControl onPlaybackRateChange={onPlaybackRateChange} is_mobile={is_mobile} />
                    </div>
                </div>
            </div>
        );
    }
);

VideoControls.displayName = 'VideoControls';
export default VideoControls;
