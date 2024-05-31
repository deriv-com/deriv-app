import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';

const ToggleFullScreen = ({ showPopover }) => {
    const [is_full_screen, setIsFullScreen] = React.useState(false);

    const fullscreen_map = {
        event: ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'],
        element: ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
        fnc_enter: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
        fnc_exit: ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'],
    };

    const onFullScreen = React.useCallback(() => {
        setIsFullScreen(fullscreen_map.element.some(el => document[el]));
    }, [fullscreen_map.element]);

    React.useEffect(() => {
        fullscreen_map.event.forEach(event => {
            document.addEventListener(event, onFullScreen, false);
        });
    }, [fullscreen_map.event, onFullScreen]);

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

    const fullScreenIcon = is_full_screen ? (
        <Icon icon='IcFullScreenRestore' className='footer__icon' />
    ) : (
        <Icon data_testid='dt_icon' icon='IcFullScreen' className='footer__icon' />
    );

    return (
        <a
            data-testid='dt_fullscreen_toggle'
            className={`${full_screen_icon_class} footer__link`}
            onClick={toggleFullScreen}
            id='dt_fullscreen_toggle'
        >
            {showPopover ? (
                <Popover
                    alignment='top'
                    message={is_full_screen ? localize('Exit') : localize('Full screen')}
                    zIndex={9999}
                >
                    {fullScreenIcon}
                </Popover>
            ) : (
                fullScreenIcon
            )}
        </a>
    );
};

ToggleFullScreen.propTypes = {
    showPopover: PropTypes.bool,
};

export { ToggleFullScreen };
