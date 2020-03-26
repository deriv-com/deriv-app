import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { Icon, Modal, VerticalTab } from '@deriv/components';
import { localize } from '@deriv/translations';
import UILoader from 'App/Components/Elements/ui-loader.jsx';
import 'Sass/app/modules/settings.scss';

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

const ChartSettingContainer = Loadable({
    loader: () =>
        import(
            /* webpackChunkName: "settings-chart", webpackPrefetch: true */ 'App/Containers/SettingsModal/settings-chart.jsx'
        ),
    loading: UILoader,
});

const ModalContent = () => {
    const content = [
        {
            icon: 'IcTheme',
            label: localize('Themes'),
            // eslint-disable-next-line react/display-name
            value: ThemeSetting,
        },
        {
            icon: 'IcLanguage',
            label: localize('Language'),
            value: LanguageSettingContainer,
        },
        {
            icon: 'IcChart',
            label: localize('Charts'),
            value: ChartSettingContainer,
            // uncomment below lines to bring back purchase lock and purchase confirmation}
            // }, {
            //     icon : IconPurchase,
            //     label: localize('Purchase'),
            //     value: PurchaseSettings,
        },
    ];
    return <VerticalTab alignment='center' classNameHeader='modal__tab-header' id='modal' list={content} />;
};

const ToggleSettings = ({ enableApp, is_settings_visible, disableApp, toggleSettings }) => {
    const toggle_settings_class = classNames('ic-settings', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a id='dt_settings_toggle' onClick={toggleSettings} className={toggle_settings_class}>
                <Icon icon='IcGear' className='footer__icon ic-settings__icon' />
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
                <ModalContent />
            </Modal>
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_settings_visible: PropTypes.bool,
    toggleSettings: PropTypes.func,
};

export { ToggleSettings };
