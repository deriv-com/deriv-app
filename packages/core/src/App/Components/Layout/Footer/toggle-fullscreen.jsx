import classNames from 'classnames';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

class ToggleFullScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_full_screen: false,
        };
        this.fullscreen_map = {
            event    : ['fullscreenchange',  'webkitfullscreenchange',  'mozfullscreenchange',  'MSFullscreenChange'],
            element  : ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
            fnc_enter: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
            fnc_exit : ['exitFullscreen',    'webkitExitFullscreen',    'mozCancelFullScreen',  'msExitFullscreen'],
        };

    }

    componentDidMount() {
        this.fullscreen_map.event.forEach((event) => {
            document.addEventListener(event, this.onFullScreen, false);
        });
    }

    onFullScreen = () => {
        const is_full_screen = this.fullscreen_map.element.some(el => document[el]);
        this.setState({ is_full_screen });
    };

    toggleFullScreen = (e) => {
        e.stopPropagation();

        const to_exit   = this.state.is_full_screen;
        const el        = to_exit ? document : document.documentElement;
        const fncToCall = this.fullscreen_map[to_exit ? 'fnc_exit' : 'fnc_enter'].find(fnc => el[fnc]);

        if (fncToCall) {
            el[fncToCall]();
        } else {
            this.setState({ is_full_screen: false }); // fullscreen API is not enabled
        }
    };

    render() {
        const full_screen_icon_class = classNames('ic-fullscreen', 'footer__link', {
            'ic-fullscreen--active': this.state.is_full_screen,
        });
        return (
            <a
                className={full_screen_icon_class}
                onClick={this.toggleFullScreen}
                id='dt_fullscreen_toggle'
            >
                <Icon icon='IconMaximize' className='footer__icon' />
            </a>
        );
    }
}

export { ToggleFullScreen };
