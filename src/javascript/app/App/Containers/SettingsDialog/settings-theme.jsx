import classNames    from 'classnames';
import React         from 'react';
import Localize      from 'App/Components/Elements/localize.jsx';
import DarkModeIcon  from 'Images/app/settings/img-theme-dark.svg';
import LightModeIcon from 'Images/app/settings/img-theme-light.svg';
import { connect }   from 'Stores/connect';
import GTM           from 'Utils/gtm';

const ThemeSelectSettings = ({ is_dark_mode, toggleDarkMode, updateBarrierColor }) => {
    const darkOnClick = () => {
        if (!is_dark_mode) {
            const new_dark_mode = toggleDarkMode();
            updateBarrierColor(new_dark_mode);
            GTM.pushDataLayer({ theme: 'dark' });
        }
    };

    const lightOnClick = () => {
        if (is_dark_mode) {
            const new_dark_mode = toggleDarkMode();
            updateBarrierColor(new_dark_mode);
            GTM.pushDataLayer({ theme: 'light' });
        }
    };
    return (
        <React.Fragment>
            <div className='theme-select-settings'>
                <h4 className='theme-select-settings__title'>
                    <Localize str='Select theme' />
                </h4>
                <div className='theme-select-settings__content'>
                    <div className='theme-select-settings__option'>
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
                            <Localize str='Dark' />
                        </p>
                    </div>
                    <div className='theme-select-settings__option'>
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
                            <Localize str='Light' />
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(({ ui, modules }) => (
    {
        is_dark_mode      : ui.is_dark_mode_on,
        toggleDarkMode    : ui.toggleDarkMode,
        updateBarrierColor: modules.smart_chart.updateBarrierColor,
    }
))(ThemeSelectSettings);
