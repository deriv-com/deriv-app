import classNames     from 'classnames';
import { Modal }      from 'deriv-components';
import PropTypes      from 'prop-types';
import React          from 'react';
import UILoader       from 'App/Components/Elements/ui-loader.jsx';
import Lazy           from 'App/Containers/Lazy';
import { localize }   from 'deriv-translations';
import Icon           from 'Assets/icon.jsx';
import VerticalTab    from 'App/Components/Elements/VerticalTabs';

import 'Sass/app/modules/settings.scss';

const ThemeSetting = () => (
    <Lazy
        ctor={() => import(/* webpackChunkName: "settings-theme", webpackPrefetch: true */'App/Containers/SettingsModal/settings-theme.jsx')}
        should_load={true}
        has_progress={true}
    />
);
const LanguageSettingContainer = () => (
    <Lazy
        ctor={() => import(/* webpackChunkName: "settings-language", webpackPrefetch: true */'App/Containers/SettingsModal/settings-language.jsx')}
        should_load={true}
        has_progress={true}
    />
);

LanguageSettingContainer.displayName = 'LanguageSettingContainer';
ThemeSetting.displayName             = 'ThemeSettingContainer';

const ModalContent = ({ settings_extension }) => {
    const content = [
        {
            icon : 'IconTheme',
            label: localize('Themes'),
            // eslint-disable-next-line react/display-name
            value: ThemeSetting,
        }, {
            icon : 'IconLanguage',
            label: localize('Language'),
            value: LanguageSettingContainer,
        },
        ...(settings_extension || []),
    ];

    return (
        <VerticalTab
            alignment='center'
            classNameHeader='modal__tab-header'
            id='modal'
            list={content}
        />
    );
};

const ToggleSettings = ({
    enableApp,
    is_settings_visible,
    disableApp,
    toggleSettings,
    settings_extension,
}) => {
    const toggle_settings_class = classNames('ic-settings', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a
                id='dt_settings_toggle'
                onClick={toggleSettings}
                className={toggle_settings_class}
            >
                <Icon icon='IconSettings' className='footer__icon ic-settings__icon' />
            </a>
            <React.Suspense fallback={<UILoader />}>
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
            </React.Suspense>
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
