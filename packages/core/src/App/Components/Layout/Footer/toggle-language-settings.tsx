import React from 'react';
import classNames from 'classnames';
import { Icon, Modal, Popover, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import 'Sass/app/modules/settings.scss';
import LanguageSettings from '../../../Containers/SettingsModal/settings-language';

export type TToggleLanguageSettings = {
    is_settings_visible: boolean;
    lang: string;
    toggleSettings: () => void;
};

const ToggleLanguageSettings = ({ is_settings_visible, toggleSettings, lang }: TToggleLanguageSettings) => {
    const toggle_settings_class = classNames('ic-language', 'footer__link', {
        'ic-settings--active': is_settings_visible,
    });
    return (
        <React.Fragment>
            <a
                id='dt_language_settings_toggle'
                data-testid='dt_toggle_language_settings'
                onClick={toggleSettings}
                className={toggle_settings_class}
            >
                <Popover alignment='top' message={localize('Language')} zIndex='9999'>
                    <Icon
                        icon={`IcFlag${lang.replace('_', '-')}`}
                        data_testid='dt_icon'
                        className='ic-settings-language__icon'
                        size={18}
                    />
                    <Text weight='bold' size='xxs'>
                        <Localize i18n_default_text={lang} />
                    </Text>
                </Popover>
            </a>
            <Modal
                id='dt_settings_modal'
                is_open={is_settings_visible}
                title={localize('Select Language')}
                toggleModal={toggleSettings}
                width='616px'
                should_header_stick_body={false}
            >
                <LanguageSettings />
            </Modal>
        </React.Fragment>
    );
};

export { ToggleLanguageSettings };
