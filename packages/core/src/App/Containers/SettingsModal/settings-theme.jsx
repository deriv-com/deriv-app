import classNames    from 'classnames';
import React         from 'react';
import { Localize }  from 'deriv-translations';
import DarkModeIcon  from 'Assets/SvgComponents/settings/img-theme-dark.svg';
import LightModeIcon from 'Assets/SvgComponents/settings/img-theme-light.svg';
import { connect }   from 'Stores/connect';
import { isBot }     from 'Utils/PlatformSwitcher';

// TODO: [disable-dark-bot] Delete all `isBot()` conditional checks when DBot dark theme is ready

const ThemeSelectSettings = ({ is_dark_mode, setDarkMode }) => {
    const darkOnClick = () => {
        if (isBot()) return;
        setDarkMode(true);
    };

    const lightOnClick = () => {
        if (isBot()) return;
        setDarkMode(false);
    };

    return (
        <React.Fragment>
            <div className='theme-select-settings'>
                <h4 className='theme-select-settings__title'>
                    <Localize i18n_default_text='Select theme' />
                </h4>
                <div className='theme-select-settings__content'>
                    <div id='dt_settings_dark_button' className='theme-select-settings__option'>
                        <DarkModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active'  : is_dark_mode && !isBot(),
                                'theme-select-settings__option__icon--disabled': isBot(),
                            })}
                            onClick={darkOnClick}
                        />
                        <p className={classNames('theme-select-settings__option__title', {
                            'theme-select-settings__option__title--selected': is_dark_mode && !isBot(),
                        })}
                        >
                            {
                                isBot() ?
                                    <Localize i18n_default_text='Dark (Coming soon to DBot)' />
                                    :
                                    <Localize i18n_default_text='Dark' />
                            }
                        </p>
                    </div>
                    <div id='dt_settings_light_button' className='theme-select-settings__option'>
                        <LightModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': !is_dark_mode || isBot(),
                            })}
                            onClick={lightOnClick}
                        />
                        <p className={classNames('theme-select-settings__option__title', {
                            'theme-select-settings__option__title--selected': !is_dark_mode || isBot(),
                        })}
                        >
                            <Localize i18n_default_text='Light' />
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(({ ui }) => (
    {
        is_dark_mode: ui.is_dark_mode_on,
        setDarkMode : ui.setDarkMode,
    }
))(ThemeSelectSettings);
