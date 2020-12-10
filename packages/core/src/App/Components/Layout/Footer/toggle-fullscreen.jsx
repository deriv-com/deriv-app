import classNames from 'classnames';
import React from 'react';
import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';

const ToggleFullScreen = () => {
    const [is_full_screen, setIsFullScreen] = React.useState(false);

    const fullscreen_map = {
        event: ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'],
        element: ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
        fnc_enter: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
        fnc_exit: ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'],
    };

    React.useEffect(() => {
        fullscreen_map.event.forEach(event => {
            document.addEventListener(event, onFullScreen, false);
        });
    }, []);

    const onFullScreen = () => {
        setIsFullScreen(fullscreen_map.element.some(el => document[el]));
    };

    const toggleFullScreen = e => {
        e.stopPropagation();

        const to_exit = is_full_screen;
        const el = to_exit ? document : document.documentElement;
        const fncToCall = fullscreen_map[to_exit ? 'fnc_exit' : 'fnc_enter'].find(fnc => el[fnc]);

        if (fncToCall) {
            el[fncToCall]();
        } else {
            setIsFullScreen(false); // fullscreen API is not enabled
        }
    };

    const full_screen_icon_class = classNames('ic-fullscreen', 'footer__link', {
        'ic-fullscreen--active': is_full_screen,
    });
    return (
        <Popover
            alignment='top'
            message={is_full_screen ? localize('Exit') : localize('Full screen')}
            className='footer__link'
        >
            <a className={full_screen_icon_class} onClick={toggleFullScreen} id='dt_fullscreen_toggle'>
                {is_full_screen ? (
                    <Icon icon='IcFullScreenRestore' className='footer__icon' />
                ) : (
                    <Icon icon='IcFullScreen' className='footer__icon' />
                )}
            </a>
        </Popover>
    );
};

export { ToggleFullScreen };
