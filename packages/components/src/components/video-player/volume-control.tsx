import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon';
import { StandaloneVolumeHighRegularIcon, StandaloneVolumeXmarkRegularIcon } from '@deriv/quill-icons';

type TVolumeControl = {
    onVolumeChange: (new_value: number) => void;
    volume?: number;
    is_mobile?: boolean;
    is_muted?: boolean;
    toggleMute: (new_value: boolean) => void;
    is_v2?: boolean;
};

const VolumeControl = ({ onVolumeChange, volume, is_mobile, is_muted, is_v2 = false, toggleMute }: TVolumeControl) => {
    const [is_animated, setIsAnimated] = React.useState(true);
    const [show_volume, setShowVolume] = React.useState(false);
    const [shift_Y, setShiftY] = React.useState(0);

    const volume_bar_filled_ref = React.useRef<HTMLDivElement>(null);
    const volume_bar_ref = React.useRef<HTMLDivElement>(null);
    const volume_dot_ref = React.useRef<HTMLSpanElement>(null);
    const is_dragging = React.useRef(false);

    const calculateNewHight = (e: React.MouseEvent<HTMLDivElement | HTMLSpanElement> | MouseEvent) => {
        const volume_bar = volume_bar_ref.current;

        let new_height =
            (((volume_bar?.getBoundingClientRect().bottom ?? 0) - e.clientY - shift_Y) /
                (volume_bar?.getBoundingClientRect().height ?? 0)) *
            100;

        if (new_height >= 100) new_height = 100;
        if (new_height <= 0) new_height = 0;

        return new_height;
    };

    const checkVolumeControl = (volume: number) => {
        if (volume) toggleMute(false);
        else toggleMute(true);
    };

    const buttonClickHandler = () => {
        if (is_muted) {
            volume_bar_filled_ref.current?.style.setProperty('height', `${(volume ?? 0.5) * 100}%`);
        }

        toggleMute(!is_muted);
    };

    const mouseMoveHandler = (e: React.MouseEvent<HTMLElement> | MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;
        if (!volume_bar_filled_ref.current) return;

        const new_height = calculateNewHight(e);
        setIsAnimated(false);
        volume_bar_filled_ref.current.style.setProperty('height', `${new_height}%`);

        onVolumeChange(new_height / 100);
        checkVolumeControl(new_height);
    };

    const mouseUpHandler = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;

        if (volume_bar_filled_ref.current) setIsAnimated(true);
        is_dragging.current = false;

        // Hide volume bar if user finished changing volume outside of the container
        if (!(e.target as HTMLElement).closest('.player__volume-bar__wrapper')) setShowVolume(false);
    };

    const mouseDownHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const point = volume_dot_ref.current;
        setShiftY((point?.getBoundingClientRect().bottom ?? 0) - e.clientY);

        is_dragging.current = true;
    };

    const onRewind = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'keydown') return;
        if ((e.target as HTMLElement).className === 'player__volume-dot') return;
        if (!volume_bar_filled_ref.current) return;

        setIsAnimated(false);
        const new_height = calculateNewHight(e as React.MouseEvent<HTMLDivElement>);
        volume_bar_filled_ref.current.style.setProperty('height', `${new_height}%`);

        onVolumeChange(new_height / 100);
        checkVolumeControl(new_height);
    };

    React.useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className='player__volume__wrapper'
            onMouseOver={is_mobile ? undefined : () => setShowVolume(true)}
            onMouseLeave={() => {
                if (!is_mobile && !is_dragging.current) {
                    setShowVolume(false);
                }
            }}
        >
            <button className='player__controls__button' onClick={buttonClickHandler}>
                {is_v2 && is_muted && <StandaloneVolumeXmarkRegularIcon fill='#ffffff' iconSize='md' />}
                {is_v2 && !is_muted && <StandaloneVolumeHighRegularIcon fill='#ffffff' iconSize='md' />}
                {!is_v2 && (
                    <Icon
                        icon={is_muted ? 'IcSoundOff' : 'IcSoundOn'}
                        custom_color='var(--text-colored-background)'
                        height={18}
                        width={20}
                    />
                )}
            </button>
            <CSSTransition
                in={show_volume}
                timeout={100}
                classNames={{
                    enter: 'player__volume-bar__wrapper--enter',
                    enterDone: 'player__volume-bar__wrapper--enter-done',
                    exit: 'player__volume-bar__wrapper--exit',
                }}
                unmountOnExit
            >
                <div className='player__volume-bar__wrapper'>
                    <div
                        className='player__volume-bar'
                        onClick={onRewind}
                        onKeyDown={onRewind}
                        ref={volume_bar_ref}
                        data-testid='dt_volume_bar'
                    >
                        <div
                            className={classNames('player__volume-bar__filled', {
                                'player__volume-bar__filled--animated': is_animated,
                            })}
                            ref={volume_bar_filled_ref}
                            style={{ height: `${is_muted ? 0 : (volume ?? 0.5) * 100}%` }}
                            data-testid='dt_volume_bar_filled'
                        >
                            <span
                                className='player__volume-dot'
                                onMouseDown={mouseDownHandler}
                                ref={volume_dot_ref}
                                data-testid='dt_volume_dot'
                            />
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default React.memo(VolumeControl);
