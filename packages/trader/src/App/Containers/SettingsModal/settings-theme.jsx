import classNames    from 'classnames';
import React         from 'react';
import { Localize }  from 'deriv-translations';
import DarkModeIcon  from 'Assets/SvgComponents/settings/img-theme-dark.svg';
import LightModeIcon from 'Assets/SvgComponents/settings/img-theme-light.svg';
import { connect }   from 'Stores/connect';

const ThemeSelectSettings = ({ is_dark_mode, toggleDarkMode, updateBarrierColor, pushDataLayer }) => {
    const darkOnClick = () => {
        if (!is_dark_mode) {
            const new_dark_mode = toggleDarkMode();
            updateBarrierColor(new_dark_mode);
            pushDataLayer({ event: 'switch theme' });
        }
    };

    const lightOnClick = () => {
        if (is_dark_mode) {
            const new_dark_mode = toggleDarkMode();
            updateBarrierColor(new_dark_mode);
            pushDataLayer({ event: 'switch theme' });
        }
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
                                'theme-select-settings__option__icon--active': is_dark_mode,
                            })}
                            onClick={darkOnClick}
                        />
                        <p className={classNames('theme-select-settings__option__title', {
                            'theme-select-settings__option__title--selected': is_dark_mode,
                        })}
                        >
                            <Localize i18n_default_text='Dark' />
                        </p>
                    </div>
                    <div id='dt_settings_light_button' className='theme-select-settings__option'>
                        <LightModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': !is_dark_mode,
                            })}
                            onClick={lightOnClick}
                        />
                        <p className={classNames('theme-select-settings__option__title', {
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

export default connect(({ ui, modules, gtm }) => (
    {
        is_dark_mode      : ui.is_dark_mode_on,
        toggleDarkMode    : ui.toggleDarkMode,
        updateBarrierColor: modules.trade.updateBarrierColor,
        pushDataLayer     : gtm.pushDataLayer,
    }
))(ThemeSelectSettings);
