import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import {
    ChartSettings,
    LanguageSettings,
    ThemeSelectSettings } from 'App/Containers/SettingsModal';
import { Modal }          from 'App/Components/Elements/modal.jsx';
import { localize }       from 'App/i18n';
import Icon               from 'Assets/icon.jsx';

const ToggleSettings = ({
    enableApp,
    is_settings_visible,
    disableApp,
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
                <Icon icon='IconSettings' className='footer__icon ic-settings__icon' />
            </a>
            <Modal
                modal_content={[
                    {
                        icon : 'IconTheme',
                        label: localize('Themes'),
                        value: ThemeSelectSettings,
                    }, {
                        icon : 'IconLanguage',
                        label: localize('Language'),
                        value: LanguageSettings,
                    }, {
                        icon : 'IconCharts',
                        label: localize('Charts'),
                        value: ChartSettings,
                        // uncomment below lines to bring back purchase lock and purchase confirmation
                        // }, {
                        //     icon : IconPurchase,
                        //     label: localize('Purchase'),
                        //     value: PurchaseSettings,
                    },
                ]}
                enableApp={enableApp}
                is_open={is_settings_visible}
                disableApp={disableApp}
                title={localize('Platform settings')}
                toggleModal={toggleSettings}
            />
        </React.Fragment>
    );
};

ToggleSettings.propTypes = {
    disableApp         : PropTypes.func,
    enableApp          : PropTypes.func,
    is_settings_visible: PropTypes.bool,
    toggleSettings     : PropTypes.func,
};

export { ToggleSettings };
