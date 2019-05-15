import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import { CSSTransition }  from 'react-transition-group';
import { SettingsDialog } from 'App/Components/Elements/SettingsDialog/settings-dialog.jsx';
import { Icon }           from 'Assets/Common';
import { IconSettings }   from 'Assets/Footer';

const ToggleSettings = ({
    hideFullBlur,
    is_dark_mode,
    is_language_visible,
    is_settings_visible,
    showFullBlur,
    toggleSettings,
}) => {
    const toggle_settings_class = classNames('ic-settings', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a
                href='javascript:;'
                onClick={toggleSettings}
                className={toggle_settings_class}
            >
                <Icon icon={IconSettings} className='footer__icon ic-settings__icon' />
            </a>
            <CSSTransition
                in={is_settings_visible}
                timeout={250}
                classNames={{
                    enter    : 'settings-dialog__container--enter',
                    enterDone: 'settings-dialog__container--enter-done',
                    exit     : 'settings-dialog__container--exit',
                }}
                unmountOnExit
            >
                <SettingsDialog
                    is_open={is_settings_visible}
                    is_language_dialog_visible={is_language_visible}
                    toggleDialog={toggleSettings}
                    is_dark_mode={is_dark_mode}
                    showFullBlur={showFullBlur}
                    hideFullBlur={hideFullBlur}
                />
            </CSSTransition>
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    hideFullBlur       : PropTypes.func,
    is_dark_mode       : PropTypes.bool,
    is_language_visible: PropTypes.bool,
    is_settings_visible: PropTypes.bool,
    showFullBlur       : PropTypes.func,
    toggleSettings     : PropTypes.func,
};

export { ToggleSettings };
