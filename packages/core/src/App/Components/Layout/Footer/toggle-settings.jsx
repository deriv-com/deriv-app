import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { Icon, Modal, Popover, VerticalTab, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import 'Sass/app/modules/settings.scss';
import { PlatformContext } from '@deriv/shared';

const ThemeSetting = Loadable({
    loader: () =>
        import(
            /* webpackChunkName: "settings-theme", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-theme.jsx'
        ),
    loading: UILoader,
});

const LanguageSettingContainer = Loadable({
    loader: () =>
        import(
            /* webpackChunkName: "settings-language", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-language.jsx'
        ),
    loading: UILoader,
});

const ModalContent = ({ settings_extension }) => {
    const { is_pre_appstore } = React.useContext(PlatformContext);
    const content = [];
    if (is_pre_appstore) {
        content.push(...(settings_extension || []));
    } else {
        content.push(
            {
                icon: 'IcTheme',
                label: localize('Themes'),
                value: ThemeSetting,
            },
            {
                icon: 'IcLanguage',
                label: localize('Language'),
                value: LanguageSettingContainer,
            },
            ...(settings_extension || [])
        );
    }

    return <VerticalTab alignment='center' classNameHeader='modal__tab-header' id='modal' list={content} />;
};

const ToggleSettings = ({ enableApp, is_settings_visible, disableApp, toggleSettings, settings_extension }) => {
    const toggle_settings_class = classNames('ic-settings', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a id='dt_settings_toggle' onClick={toggleSettings} className={`${toggle_settings_class} footer__link`}>
                <Popover alignment='top' message={localize('Platform settings')} zIndex={9999}>
                    <Icon icon='IcGear' className='footer__icon ic-settings__icon' />
                </Popover>
            </a>
            <Modal
                id='dt_settings_modal'
                className='modal-settings'
                enableApp={enableApp}
                is_open={is_settings_visible}
                disableApp={disableApp}
                title={localize('Platform settings')}
                toggleModal={toggleSettings}
                height='616px'
                width='736px'
            >
                <ModalContent settings_extension={settings_extension} />
            </Modal>
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_settings_visible: PropTypes.bool,
    settings_extension: PropTypes.array,
    toggleSettings: PropTypes.func,
};

export { ToggleSettings };
