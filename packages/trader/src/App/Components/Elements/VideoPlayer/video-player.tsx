import React from 'react';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { isSafari, mobileOSDetect } from '@deriv/shared';
import VideoOverlay from './video-overlay';
import VideoControls from './video-controls';

type TVideoPlayerProps = {
    src: string;
    is_mobile?: boolean;
    data_testid?: string;
};

const VideoPlayer = ({ src, is_mobile, data_testid }: TVideoPlayerProps) => {
    const should_autoplay =
        (!isSafari() || (is_mobile && mobileOSDetect() !== 'iOS' && mobileOSDetect() !== 'unknown')) ?? true;
    const [is_animated, setIsAnimated] = React.useState(true);
    const [is_playing, setIsPlaying] = React.useState(false);
    const [is_ended, setIsEnded] = React.useState(false);
    const [is_muted, setIsMuted] = React.useState(false);
    const [has_enlarged_dot, setHasEnlargedDot] = React.useState(false);
    const [current_time, setCurrentTime] = React.useState<number>();
    const [video_duration, setVideoDuration] = React.useState<number>();
    const [shift_X, setShiftX] = React.useState<number>(0);
    const [show_controls, setShowControls] = React.useState(!should_autoplay);

    const video_ref = React.useRef<StreamPlayerApi>();
    const progress_bar_filled_ref = React.useRef<HTMLDivElement>(null);
    const progress_bar_ref = React.useRef<HTMLDivElement>(null);
    const progress_dot_ref = React.useRef<HTMLSpanElement>(null);
    const animation_ref = React.useRef<number>(0);
    const timer_ref = React.useRef<ReturnType<typeof setTimeout>>();
    const is_dragging = React.useRef<boolean>(false);

    const onVolumeChange = (new_value: number) => {
        if (!video_ref.current) return;

        video_ref.current.volume = new_value;
    };

    const onPlaybackRateChange = (new_value: number) => {
        if (!video_ref.current) return;

        video_ref.current.playbackRate = new_value;
    };

    const togglePlay = (
        e:
            | React.MouseEvent<HTMLDivElement | HTMLButtonElement>
            | React.KeyboardEvent<HTMLDivElement | HTMLButtonElement>
    ) => {
        e.stopPropagation();

        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        if (is_playing) {
            video_ref.current.pause();
            setIsAnimated(false);
            cancelAnimationFrame(animation_ref.current);
        } else {
            video_ref.current.play();
            setIsAnimated(true);
        }

        setIsPlaying(prev => !prev);
        setIsEnded(false);
    };

    const calculateNewWidth = (
        e:
            | React.MouseEvent<HTMLDivElement | HTMLSpanElement>
            | React.TouchEvent<HTMLDivElement | HTMLSpanElement>
            | TouchEvent
            | MouseEvent
    ) => {
        const progress_bar = progress_bar_ref.current;
        const client_X =
            e.type === 'mousemove' || e.type === 'click'
                ? (e as MouseEvent).clientX
                : (e as TouchEvent).changedTouches[0].clientX;

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

    const dragStartHandler = (e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => {
        if (e.type === 'mousedown') e.preventDefault();
        e.stopPropagation();

        const point = progress_dot_ref.current as HTMLElement;
        const client_X =
            e.type === 'mousedown'
                ? (e as React.MouseEvent<HTMLSpanElement>).clientX
                : (e as React.TouchEvent<HTMLSpanElement>).changedTouches[0].clientX;
        setShiftX(client_X - (point?.getBoundingClientRect().left ?? 0));

        video_ref?.current?.pause();
        setIsPlaying(false);
        setIsAnimated(false);

        is_dragging.current = true;

        if (is_mobile) setHasEnlargedDot(true);
    };

    const dragMoveHandler = (
        e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | TouchEvent | MouseEvent
    ) => {
        if (e.type === 'mousemove') e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        const new_width = calculateNewWidth(e);
        progress_bar_filled_ref.current.style.setProperty('width', `${new_width}%`);
        video_ref.current.currentTime = (Number(video_ref.current.duration) * new_width) / 100;

        setIsPlaying(!video_ref.current.paused);
    };

    const dragEndHandler = (e: MouseEvent | TouchEvent) => {
        if (e.type === 'mouseup') e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;

        video_ref?.current?.play();
        setIsPlaying(true);
        setIsAnimated(true);
        setIsEnded(false);

        is_dragging.current = false;

        if (is_mobile) setHasEnlargedDot(false);
    };

    const onRewind = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if ((e.target as HTMLElement).className === 'player__progress-dot') return;
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        video_ref.current.pause();
        setIsAnimated(false);

        const new_width = calculateNewWidth(e);

        progress_bar_filled_ref.current.style.setProperty('width', `${new_width}%`);
        video_ref.current.currentTime = (Number(video_ref.current.duration) * new_width) / 100;

        timer_ref.current = setTimeout(() => {
            video_ref?.current?.play();
            setIsPlaying(true);
            setIsAnimated(true);
            setIsEnded(false);
        }, 500);
    };

    const onLoadedMetadata = () => {
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        setVideoDuration(video_ref.current.duration);
        setIsPlaying(should_autoplay);
        video_ref.current.volume = 0.5;
    };

    const onEnded = () => {
        setIsPlaying(false);
        setIsEnded(true);
        setIsAnimated(false);
    };

    const repeat = React.useCallback(() => {
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        setCurrentTime(video_ref.current.currentTime);
        const new_width = (video_ref.current.currentTime / Number(video_ref.current.duration)) * 100;
        progress_bar_filled_ref.current.style.setProperty('width', `${new_width >= 99 ? 100 : new_width}%`);

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
            document.addEventListener('touchmove', dragMoveHandler);
            document.addEventListener('touchend', dragEndHandler);
            document.addEventListener('touchcancel', dragEndHandler);
        } else {
            document.addEventListener('mousemove', dragMoveHandler);
            document.addEventListener('mouseup', dragEndHandler);
        }

        return () => {
            cancelAnimationFrame(animation_ref.current);
            if (is_mobile) {
                document.removeEventListener('touchmove', dragMoveHandler);
                document.removeEventListener('touchend', dragEndHandler);
                document.removeEventListener('touchcancel', dragEndHandler);
            } else {
                document.removeEventListener('mousemove', dragMoveHandler);
                document.removeEventListener('mouseup', dragEndHandler);
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
                autoplay
                height={is_mobile ? '184.5px' : '270px'}
                letterboxColor='transparent'
                muted={is_muted}
                preload='auto'
                responsive={false}
                src={src}
                streamRef={video_ref}
                width='100%'
                onEnded={onEnded}
                onLoadedMetaData={onLoadedMetadata}
            />
            <VideoOverlay
                onClick={is_mobile && !is_ended ? () => setShowControls(!show_controls) : togglePlay}
                is_ended={is_ended}
                is_mobile={is_mobile}
            />
            <VideoControls
                block_controls={is_dragging.current}
                current_time={current_time}
                dragStartHandler={dragStartHandler}
                has_enlarged_dot={has_enlarged_dot}
                is_animated={is_animated}
                is_ended={is_ended}
                is_playing={is_playing}
                is_mobile={is_mobile}
                is_muted={is_muted}
                onRewind={onRewind}
                onVolumeChange={onVolumeChange}
                onPlaybackRateChange={onPlaybackRateChange}
                show_controls={show_controls}
                togglePlay={togglePlay}
                toggleMute={setIsMuted}
                video_duration={video_duration}
                volume={video_ref.current?.volume}
                progress_bar_filled_ref={progress_bar_filled_ref}
                progress_bar_ref={progress_bar_ref}
                progress_dot_ref={progress_dot_ref}
            />
        </div>
    );
};

export default React.memo(VideoPlayer);
