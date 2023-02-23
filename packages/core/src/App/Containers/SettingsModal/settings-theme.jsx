import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import DarkModeIcon from 'Assets/SvgComponents/settings/img-theme-dark.svg';
import LightModeIcon from 'Assets/SvgComponents/settings/img-theme-light.svg';
import { connect } from 'Stores/connect';

const ThemeSelectSettings = ({ is_dark_mode, setDarkMode }) => {
    const darkOnClick = () => {
        setDarkMode(true);
    };

    const lightOnClick = () => {
        setDarkMode(false);
    };

    return (
        <React.Fragment>
            <div className='theme-select-settings'>
                <Text as='h4' weight='bold' size='xs' className='theme-select-settings__title'>
                    <Localize i18n_default_text='Select theme' />
                </Text>
                <div className='theme-select-settings__content'>
                    <div id='dt_settings_dark_button' className='theme-select-settings__option'>
                        <DarkModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': is_dark_mode,
                            })}
                            onClick={darkOnClick}
                        />
                        <p
                            className={classNames('theme-select-settings__option__title', {
                                'theme-select-settings__option__title--selected': is_dark_mode,
                            })}
                        >
                            {<Localize i18n_default_text='Dark' />}
                        </p>
                    </div>
                    <div id='dt_settings_light_button' className='theme-select-settings__option'>
                        <LightModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': !is_dark_mode,
                            })}
                            onClick={lightOnClick}
                        />
                        <p
                            className={classNames('theme-select-settings__option__title', {
                                'theme-select-settings__option__title--selected': !is_dark_mode,
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

export default connect(({ ui }) => ({
    is_dark_mode: ui.is_dark_mode_on,
    setDarkMode: ui.setDarkMode,
}))(ThemeSelectSettings);
