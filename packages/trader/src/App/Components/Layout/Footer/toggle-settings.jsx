import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Modal }    from 'App/Components/Elements/modal.jsx';
import UILoader     from 'App/Components/Elements/ui-loader.jsx';
import Lazy         from 'App/Containers/Lazy';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';
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

const ChartSettingContainer = () => (
    <Lazy
        ctor={() => import(/* webpackChunkName: "settings-chart", webpackPrefetch: true */'App/Containers/SettingsModal/settings-chart.jsx')}
    />
);

ChartSettingContainer.displayName    = 'ChartSettingContainer';
LanguageSettingContainer.displayName = 'LanguageSettingContainer';
ThemeSetting.displayName             = 'ThemeSettingContainer';

const modal_content = [
    {
        icon : 'IconTheme',
        label: localize('Themes'),
        // eslint-disable-next-line react/display-name
        value: ThemeSetting,
    }, {
        icon : 'IconLanguage',
        label: localize('Language'),
        value: LanguageSettingContainer,
    }, {
        icon : 'IconCharts',
        label: localize('Charts'),
        value: ChartSettingContainer,
        // uncomment below lines to bring back purchase lock and purchase confirmation}
        // }, {
        //     icon : IconPurchase,
        //     label: localize('Purchase'),
        //     value: PurchaseSettings,
    },
];

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
                id='dt_settings_toggle'
                href='javascript:;'
                onClick={toggleSettings}
                className={toggle_settings_class}
            >
                <Icon icon='IconSettings' className='footer__icon ic-settings__icon' />
            </a>
            {is_settings_visible &&
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    id='dt_settings_modal'
                    modal_content={modal_content}
                    enableApp={enableApp}
                    is_open={is_settings_visible}
                    disableApp={disableApp}
                    title={localize('Platform settings')}
                    toggleModal={toggleSettings}
                />
            </React.Suspense>
            }
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
