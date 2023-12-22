import React from 'react';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { checkUserBrowser, mobileOSDetect } from '@deriv/shared';
import VideoOverlay from './video-overlay';
import VideoControls from './video-controls';

type TVideoPlayerProps = {
    src: string;
    is_mobile?: boolean;
    data_testid?: string;
};

const VideoPlayer = ({ src, is_mobile, data_testid }: TVideoPlayerProps) => {
    const should_autoplay =
        checkUserBrowser() !== 'Safari' || (is_mobile && mobileOSDetect() !== 'iOS' && mobileOSDetect() !== 'unknown');

    const [is_playing, setIsPlaying] = React.useState(false);
    const [is_ended, setIsEnded] = React.useState(false);
    const [current_time, setCurrentTime] = React.useState<number>();
    const [video_duration, setVideoDuration] = React.useState<number>();
    const [shift_X, setShiftX] = React.useState<number>(0);
    const [show_controls, setShowControls] = React.useState(!should_autoplay);

    const video_ref = React.useRef<StreamPlayerApi>();
    const progress_bar_ref = React.useRef<HTMLDivElement>(null);
    const animation_ref = React.useRef<number>(0);
    const timer_ref = React.useRef<ReturnType<typeof setTimeout>>();
    const is_dragging = React.useRef<boolean>(false);

    const onVolumeChange = (new_value: number) => {
        if (!video_ref?.current) return;

        video_ref.current.volume = new_value;
    };

    const toggleMute = (new_value: boolean) => {
        if (!video_ref?.current) return;

        video_ref.current.muted = new_value;
    };

    const onPlaybackRateChange = (new_value: number) => {
        if (!video_ref?.current) return;

        video_ref.current.playbackRate = new_value;
    };

    const togglePlaying = (e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => {
        e.stopPropagation();

        if (!video_ref?.current || !progress_bar_ref?.current) return;

        if (is_playing) {
            video_ref.current.pause();
            progress_bar_ref.current.style.setProperty('transition', 'none');
            cancelAnimationFrame(animation_ref.current);
        } else {
            video_ref.current.play();
        }

        setIsPlaying(prev => !prev);
        setIsEnded(false);
    };

    const calculateNewWidth = (e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>) => {
        const progress_bar = document.querySelector('.player__controls__progress-bar');
        const client_X =
            e.type === 'mousemove' || e.type === 'click'
                ? (e as React.MouseEvent<HTMLElement, MouseEvent>).clientX
                : (e as React.TouchEvent<HTMLElement>).changedTouches[0].clientX;

        let new_width =
            ((client_X - shift_X - (progress_bar?.getBoundingClientRect().left ?? 0)) /
                (progress_bar?.getBoundingClientRect().width ?? 0)) *
            100;
        if (new_width >= 100) {
            new_width = 100;
        }
        if (new_width <= 0) {
            new_width = 0;
        }

        return new_width;
    };

    const dragStartHandler = (e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>) => {
        if (e.type === 'mousedown') e.preventDefault();
        e.stopPropagation();

        const point = document.querySelector('.player__progress-dot');
        const client_X =
            e.type === 'mousedown'
                ? (e as React.MouseEvent<HTMLElement, MouseEvent>).clientX
                : (e as React.TouchEvent<HTMLElement>).changedTouches[0].clientX;
        setShiftX(client_X - (point?.getBoundingClientRect().left ?? 0));

        video_ref?.current?.pause();
        setIsPlaying(false);
        is_dragging.current = true;
    };

    const dragMoveHandler = (e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>) => {
        if (e.type === 'mousemove') e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;
        if (!video_ref?.current || !progress_bar_ref?.current) return;

        const new_width = calculateNewWidth(e);
        progress_bar_ref.current.style.setProperty('transition', 'none');
        progress_bar_ref.current.style.setProperty('width', `${new_width}%`);
        video_ref.current.currentTime = (Number(video_ref.current.duration) * new_width) / 100;

        setIsPlaying(!video_ref.current.paused);
    };

    const dragEndHandler = (e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>) => {
        if (e.type === 'mouseup') e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;

        if (progress_bar_ref?.current && video_ref.current) {
            progress_bar_ref.current.style.setProperty('transition', 'all 0.3s linear');
        }

        video_ref?.current?.play();
        setIsPlaying(true);
        setIsEnded(false);

        is_dragging.current = false;
    };

    const onRewind = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        if ((e.target as HTMLElement).className === 'player__progress-dot') return;
        if (!video_ref?.current || !progress_bar_ref?.current) return;

        video_ref.current.pause();

        const new_width = calculateNewWidth(e);

        progress_bar_ref.current.style.setProperty('transition', 'none');
        progress_bar_ref.current.style.setProperty('width', `${new_width}%`);
        video_ref.current.currentTime = (Number(video_ref.current.duration) * new_width) / 100;

        timer_ref.current = setTimeout(() => {
            video_ref?.current?.play();
            setIsPlaying(true);
            setIsEnded(false);
        }, 500);
    };

    const onLoadedMetadata = () => {
        if (!video_ref?.current || !progress_bar_ref?.current) return;

        setVideoDuration(video_ref.current.duration);
        setIsPlaying(!!should_autoplay);
        video_ref.current.volume = 0.5;
    };

    const onEnded = () => {
        setIsPlaying(false);
        setIsEnded(true);

        // If user switch to another tab until the end of the video, the requestAnimationFrame will stop working, but we need to change progress bar to 100%
        progress_bar_ref.current && progress_bar_ref.current.style.setProperty('width', '100%');
    };

    const repeat = React.useCallback(() => {
        if (!video_ref?.current || !progress_bar_ref?.current) return;

        setCurrentTime(video_ref.current.currentTime);
        progress_bar_ref.current.style.setProperty('transition', 'all 0.3s linear');
        const new_width = (video_ref.current.currentTime / Number(video_ref.current.duration)) * 100;
        progress_bar_ref.current.style.setProperty('width', `${new_width >= 99 ? 100 : new_width}%`);

        animation_ref.current = requestAnimationFrame(repeat);
    }, []);

    React.useEffect(() => {
        if (is_playing) {
            animation_ref.current = requestAnimationFrame(repeat);
        } else {
            cancelAnimationFrame(animation_ref.current);
        }
    }, [is_playing, repeat]);

    React.useEffect(() => {
        if (is_mobile) {
            document.addEventListener(
                'touchmove',
                dragMoveHandler as unknown as (this: Document, ev: TouchEvent) => void
            );
            document.addEventListener(
                'touchend',
                dragEndHandler as unknown as (this: Document, ev: TouchEvent) => void
            );
            document.addEventListener(
                'touchcancel',
                dragEndHandler as unknown as (this: Document, ev: TouchEvent) => void
            );
        } else {
            document.addEventListener(
                'mousemove',
                dragMoveHandler as unknown as (this: Document, ev: MouseEvent) => void
            );
            document.addEventListener('mouseup', dragEndHandler as unknown as (this: Document, ev: MouseEvent) => void);
        }

        return () => {
            cancelAnimationFrame(animation_ref.current);
            if (is_mobile) {
                document.removeEventListener(
                    'touchmove',
                    dragMoveHandler as unknown as (this: Document, ev: TouchEvent) => void
                );
                document.removeEventListener(
                    'touchend',
                    dragEndHandler as unknown as (this: Document, ev: TouchEvent) => void
                );
                document.removeEventListener(
                    'touchcancel',
                    dragEndHandler as unknown as (this: Document, ev: TouchEvent) => void
                );
            } else {
                document.removeEventListener(
                    'mousemove',
                    dragMoveHandler as unknown as (this: Document, ev: MouseEvent) => void
                );
                document.removeEventListener(
                    'mouseup',
                    dragEndHandler as unknown as (this: Document, ev: MouseEvent) => void
                );
            }

            clearTimeout(timer_ref.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className='player__wrapper'
            onMouseOver={is_mobile ? undefined : () => setShowControls(true)}
            onMouseLeave={is_mobile ? undefined : () => setShowControls(false)}
            data-testid={data_testid}
        >
            <Stream
                autoplay={should_autoplay}
                controls={false}
                height={is_mobile ? '184.5px' : '270px'}
                letterboxColor='transparent'
                loop={false}
                preload='auto'
                responsive={false}
                src={src}
                streamRef={video_ref}
                width='100%'
                onEnded={onEnded}
                onLoadedMetaData={onLoadedMetadata}
            />
            <VideoOverlay
                onClick={is_mobile && !is_ended ? () => setShowControls(!show_controls) : togglePlaying}
                is_ended={is_ended}
                is_mobile={is_mobile}
            />
            <VideoControls
                block_controls={is_dragging.current}
                current_time={current_time}
                is_playing={is_playing}
                is_mobile={is_mobile}
                dragStartHandler={dragStartHandler}
                onRewind={onRewind}
                onVolumeChange={onVolumeChange}
                onPlaybackRateChange={onPlaybackRateChange}
                togglePlaying={togglePlaying}
                video_duration={video_duration}
                volume={video_ref.current?.volume}
                toggleMute={toggleMute}
                show_controls={show_controls}
                ref={progress_bar_ref}
            />
        </div>
    );
};

export default React.memo(VideoPlayer);
