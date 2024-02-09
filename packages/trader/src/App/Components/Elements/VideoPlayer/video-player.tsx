import React from 'react';
import { Stream, StreamPlayerApi } from '@cloudflare/stream-react';
import { user_browser, mobileOSDetect } from '@deriv/shared';
import debounce from 'lodash.debounce';
import VideoOverlay from './video-overlay';
import VideoControls from './video-controls';

type TVideoPlayerProps = {
    src: string;
    is_mobile?: boolean;
    data_testid?: string;
};

const VideoPlayer = ({ src, is_mobile, data_testid }: TVideoPlayerProps) => {
    const should_autoplay =
        (!user_browser.isSafari() || (is_mobile && mobileOSDetect() !== 'iOS' && mobileOSDetect() !== 'unknown')) ??
        true;

    const [current_time, setCurrentTime] = React.useState<number>();
    const [has_enlarged_dot, setHasEnlargedDot] = React.useState(false);
    const [is_animated, setIsAnimated] = React.useState(true);
    const [is_playing, setIsPlaying] = React.useState(false);
    const [is_ended, setIsEnded] = React.useState(false);
    const [is_muted, setIsMuted] = React.useState(false);
    const [playback_rate, setPlaybackRate] = React.useState(1);
    const [show_controls, setShowControls] = React.useState(!should_autoplay);
    const [shift_X, setShiftX] = React.useState(0);
    const [video_duration, setVideoDuration] = React.useState<number>();
    const [volume, setVolume] = React.useState(0.5);

    const video_ref = React.useRef<StreamPlayerApi>();
    const progress_bar_filled_ref = React.useRef<HTMLDivElement>(null);
    const progress_bar_ref = React.useRef<HTMLDivElement>(null);
    const progress_dot_ref = React.useRef<HTMLSpanElement>(null);
    const animation_ref = React.useRef(0);
    const new_time_ref = React.useRef(0);
    const should_check_time_ref = React.useRef(false);

    // const play_on_rewind_timeout = React.useRef<ReturnType<typeof setTimeout>>();
    const replay_animation_timeout = React.useRef<ReturnType<typeof setTimeout>>();
    const toggle_animation_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const is_dragging = React.useRef(false);

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
        if (new_width >= 100) new_width = 100;
        if (new_width <= 0) new_width = 0;
        return parseFloat(new_width.toFixed(3));
    };

    const dragStartHandler = (e: React.MouseEvent<HTMLSpanElement> | React.TouchEvent<HTMLSpanElement>) => {
        if (e.type === 'mousedown') e.preventDefault();
        e.stopPropagation();

        cancelAnimationFrame(animation_ref.current);
        debouncedDragging.cancel();
        video_ref?.current?.pause();
        setIsPlaying(false);
        setIsAnimated(false);
        is_dragging.current = true;

        const point = progress_dot_ref.current as HTMLElement;
        const client_X =
            e.type === 'mousedown'
                ? (e as React.MouseEvent<HTMLSpanElement>).clientX
                : (e as React.TouchEvent<HTMLSpanElement>).changedTouches[0].clientX;
        setShiftX(client_X - (point?.getBoundingClientRect().left ?? 0));

        if (is_mobile) setHasEnlargedDot(true);
    };

    const dragMoveHandler = (
        e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | TouchEvent | MouseEvent
    ) => {
        if (e.type === 'mousemove') e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;
        if (!video_ref.current || !progress_bar_filled_ref.current) return;
        cancelAnimationFrame(animation_ref.current);
        debouncedDragging.cancel();
        // clearTimeout(play_on_rewind_timeout.current);

        const new_width = calculateNewWidth(e);
        progress_bar_filled_ref.current.style.setProperty('width', `${new_width}%`);
        const new_time = Math.round((Number(video_ref.current.duration) * new_width) / 100);
        video_ref.current.currentTime = new_time >= video_ref.current.duration ? video_ref.current.duration : new_time;
        new_time_ref.current = new_time >= video_ref.current.duration ? video_ref.current.duration : new_time;
        // console.log('test dragEndHandler time NEW', Math.round((Number(video_ref.current.duration) * new_width) / 100));
    };

    const dragEndHandler = (e: MouseEvent | TouchEvent) => {
        if (e.type === 'mouseup') e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        cancelAnimationFrame(animation_ref.current);
        // clearTimeout(play_on_rewind_timeout.current);

        is_dragging.current = false;
        setIsEnded(false);
        should_check_time_ref.current = true;

        // play_on_rewind_timeout.current = setTimeout(() => {
        //     if (!video_ref?.current?.ended) setIsAnimated(true);
        //     animation_ref.current = requestAnimationFrame(repeat);
        //     video_ref?.current?.play();
        // }, 500);
        debouncedDragging.cancel();
        //here
        debouncedDragging();

        if (is_mobile) setHasEnlargedDot(false);
    };

    const debouncedDragging = debounce(() => {
        if (!video_ref?.current?.ended) setIsAnimated(true);
        animation_ref.current = requestAnimationFrame(repeat);
        video_ref?.current?.play();
    }, 500);

    const onRewind = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (is_dragging.current) return;

        if (e.type === 'keydown') return;
        if ((e.target as HTMLElement).className === 'player__progress-dot') return;
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        cancelAnimationFrame(animation_ref.current);
        setIsAnimated(false);
        setIsEnded(false);
        video_ref.current.pause();

        const new_width = calculateNewWidth(e as React.MouseEvent<HTMLDivElement>);
        progress_bar_filled_ref.current.style.setProperty('width', `${new_width}%`);
        const new_time = Math.round((Number(video_ref.current.duration) * new_width) / 100);
        // console.log('test new_time', new_time);
        // console.log('test video_ref.current.duration ', video_ref.current.duration);
        // console.log('test result ', new_time > video_ref.current.duration ? video_ref.current.duration : new_time);

        video_ref.current.currentTime = new_time >= video_ref.current.duration ? video_ref.current.duration : new_time;
        new_time_ref.current = new_time >= video_ref.current.duration ? video_ref.current.duration : new_time;
        should_check_time_ref.current = true;

        // if (!is_playing) {
        //     play_on_rewind_timeout.current = setTimeout(() => {
        //         setIsAnimated(true);
        //         video_ref?.current?.play();
        //         animation_ref.current = requestAnimationFrame(repeat);
        //     }, 500);
        // } else {
        //     play_on_rewind_timeout.current = setTimeout(() => {
        //         setIsAnimated(true);
        //         video_ref?.current?.play();
        //         animation_ref.current = requestAnimationFrame(repeat);
        //     }, 500);
        // }
        // play_on_rewind_timeout.current = setTimeout(() => {
        //     setIsAnimated(true);
        //     video_ref?.current?.play();
        //     animation_ref.current = requestAnimationFrame(repeat);
        // }, 500);
        // debouncedRewind.cancel();
        if (!(new_time >= video_ref.current.duration)) debouncedRewind();
    };

    const debouncedRewind = debounce(() => {
        setIsAnimated(true);
        video_ref?.current?.play();
        animation_ref.current = requestAnimationFrame(repeat);
    }, 500);

    const onLoadedMetaData = () => {
        if (!video_ref.current || !progress_bar_filled_ref.current) return;

        setVideoDuration(video_ref.current.duration);
        setIsPlaying(should_autoplay);

        if (should_autoplay) animation_ref.current = requestAnimationFrame(repeat);
    };

    const onEnded = () => {
        // console.log('test onEnded');
        setIsEnded(true);
        progress_bar_filled_ref?.current?.style.setProperty('width', '100%');
        setCurrentTime(video_duration);
        setIsPlaying(false);
        setIsAnimated(false);
        cancelAnimationFrame(animation_ref.current);
        should_check_time_ref.current = false;
    };

    const repeat = () => {
        if (!video_ref.current || !progress_bar_filled_ref.current) return;
        // console.log('test new_time_ref.current', new_time_ref.current);
        // console.log('test video_ref.current.currentTime', video_ref.current.currentTime);

        if (should_check_time_ref.current && new_time_ref.current !== video_ref.current.currentTime) {
            animation_ref.current = requestAnimationFrame(repeat);
            return;
        }
        if (should_check_time_ref.current) should_check_time_ref.current = false;
        // console.log('test REPEAT TIME', video_ref.current.currentTime);
        setCurrentTime(video_ref.current.currentTime);

        const new_width = parseFloat(
            ((video_ref.current.currentTime / Number(video_ref.current.duration)) * 100).toFixed(3)
        );

        progress_bar_filled_ref.current.style.setProperty('width', `${new_width >= 99 ? 100 : new_width}%`);

        animation_ref.current = requestAnimationFrame(repeat);
    };

    const togglePlay = React.useCallback(
        (
            e:
                | React.MouseEvent<HTMLDivElement | HTMLButtonElement>
                | React.KeyboardEvent<HTMLDivElement | HTMLButtonElement>
        ) => {
            e.stopPropagation();

            if (!video_ref.current || !progress_bar_filled_ref.current) return;
            // console.log('test togglePlay');
            cancelAnimationFrame(animation_ref.current);
            clearTimeout(replay_animation_timeout.current);
            clearTimeout(toggle_animation_timeout.current);
            setIsAnimated(false);
            setIsEnded(false);

            if (is_playing) {
                video_ref.current.pause();
                setIsPlaying(false);
            } else {
                // setIsPlaying(true);
                // console.log('test should_check_time_ref.current', should_check_time_ref.current);
                replay_animation_timeout.current = setTimeout(() => {
                    // console.log('test should_check_time_ref.current', should_check_time_ref.current);

                    video_ref?.current?.play();
                    animation_ref.current = requestAnimationFrame(repeat);
                }, 200);
                toggle_animation_timeout.current = setTimeout(() => {
                    setIsAnimated(true);
                }, 1000);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [is_playing]
    );

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

            // clearTimeout(play_on_rewind_timeout.current);
            debouncedDragging.cancel();
            debouncedRewind.cancel();
            clearTimeout(replay_animation_timeout.current);
            clearTimeout(toggle_animation_timeout.current);
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
                height={is_mobile ? '184.5px' : '270px'}
                letterboxColor='transparent'
                muted={is_muted}
                preload='auto'
                responsive={false}
                src={src}
                streamRef={video_ref}
                width='100%'
                onEnded={onEnded}
                onPlay={() => setIsPlaying(true)}
                onLoadedMetaData={onLoadedMetaData}
                playbackRate={playback_rate}
                volume={volume}
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
                onVolumeChange={setVolume}
                onPlaybackRateChange={setPlaybackRate}
                show_controls={show_controls}
                togglePlay={togglePlay}
                toggleMute={setIsMuted}
                video_duration={video_duration}
                volume={volume}
                progress_bar_filled_ref={progress_bar_filled_ref}
                progress_bar_ref={progress_bar_ref}
                progress_dot_ref={progress_dot_ref}
                playback_rate={playback_rate}
            />
        </div>
    );
};

export default React.memo(VideoPlayer);
