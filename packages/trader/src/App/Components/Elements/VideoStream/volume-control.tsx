import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';

type TVolumeControl = {
    onVolumeChange: (new_value: number) => void;
    volume?: number;
    is_mobile?: boolean;
    toggleMute: (new_value: boolean) => void;
};

const VolumeControl = ({ onVolumeChange, volume, is_mobile, toggleMute }: TVolumeControl) => {
    const [show_volume, setShowVolume] = React.useState(false);
    const [is_muted, setIsMuted] = React.useState(false);
    const [shift_Y, setShiftY] = React.useState<number>(0);

    const volume_bar_ref = React.useRef<HTMLDivElement>(null);
    const is_dragging = React.useRef<boolean>(false);

    const calculateNewHight = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const volume_bar = document.querySelector('.player__volume-bar');

        let new_height =
            (((volume_bar?.getBoundingClientRect().bottom ?? 0) - e.clientY - shift_Y) /
                (volume_bar?.getBoundingClientRect().height ?? 0)) *
            100;

        if (new_height >= 100) {
            new_height = 100;
        }
        if (new_height <= 0) {
            new_height = 0;
        }
        return new_height;
    };

    const checkVolumeControl = (volume: number) => {
        if (!volume) {
            setIsMuted(true);
            toggleMute(true);

            return;
        }
        setIsMuted(false);
        toggleMute(false);
    };

    const buttonClickHandler = () => {
        if (is_muted) {
            volume_bar_ref?.current && volume_bar_ref.current.style.setProperty('height', `${(volume ?? 0.5) * 100}%`);
            toggleMute(false);
        } else {
            volume_bar_ref?.current && volume_bar_ref.current.style.setProperty('height', '0%');
            toggleMute(true);
        }
        setIsMuted(prev => !prev);
    };

    const mouseMoveHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;
        if (!volume_bar_ref?.current) return;

        const new_height = calculateNewHight(e);

        volume_bar_ref.current.style.setProperty('transition', 'none');
        volume_bar_ref.current.style.setProperty('height', `${new_height}%`);

        onVolumeChange(new_height / 100);
        checkVolumeControl(new_height);
    };

    const mouseUpHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!is_dragging.current) return;

        if (volume_bar_ref?.current) {
            volume_bar_ref.current.style.setProperty('transition', 'all 0.3s linear');
        }
        is_dragging.current = false;

        // Hide volume bar if user finished changing volume outside of the container
        if (!(e.target as HTMLElement).closest('.player__volume-bar__wrapper')) setShowVolume(false);
    };

    const mouseDownHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        const point = document.querySelector('.player__volume-dot');
        setShiftY((point?.getBoundingClientRect().bottom ?? 0) - e.clientY);

        is_dragging.current = true;
    };

    const onRewind = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        if ((e.target as HTMLElement).className === 'player__volume-dot') return;
        if (!volume_bar_ref?.current) return;

        const new_height = calculateNewHight(e);

        volume_bar_ref.current.style.setProperty('transition', 'none');
        volume_bar_ref.current.style.setProperty('height', `${new_height}%`);

        onVolumeChange(new_height / 100);
        checkVolumeControl(new_height);
    };

    React.useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler as unknown as (this: Document, ev: MouseEvent) => void);
        document.addEventListener('mouseup', mouseUpHandler as unknown as (this: Document, ev: MouseEvent) => void);

        return () => {
            document.removeEventListener(
                'mousemove',
                mouseMoveHandler as unknown as (this: Document, ev: MouseEvent) => void
            );
            document.removeEventListener(
                'mouseup',
                mouseUpHandler as unknown as (this: Document, ev: MouseEvent) => void
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className='player__volume__wrapper'
            onMouseOver={is_mobile ? undefined : () => setShowVolume(true)}
            onMouseLeave={is_mobile || is_dragging.current ? undefined : () => setShowVolume(false)}
        >
            <button className='player__controls__button' onClick={buttonClickHandler}>
                <Icon
                    icon={is_muted ? 'IcSoundOff' : 'IcSoundOn'}
                    custom_color='var(--text-colored-background)'
                    height={18}
                    width={20}
                />
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
                    <div className='player__volume-bar' onClick={e => onRewind(e)} onKeyDown={undefined}>
                        <div
                            className='player__volume-bar__filled'
                            ref={volume_bar_ref}
                            style={{ height: `${is_muted ? 0 : (volume ?? 0.5) * 100}%` }}
                        >
                            <span
                                className='player__volume-dot'
                                onMouseDown={e => mouseDownHandler(e)}
                                onDragStart={() => false}
                            />
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default VolumeControl;
