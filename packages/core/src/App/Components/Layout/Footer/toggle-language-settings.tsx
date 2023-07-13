import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Icon, Modal, Popover, Text } from '@deriv/components';
import { Localize, localize, useLanguageSettings } from '@deriv/translations';
import LanguageSettings from '../../../Containers/SettingsModal/settings-language';
// eslint-disable-next-line import/no-unresolved
import 'Sass/app/modules/settings.scss';

const ToggleLanguageSettings = observer(() => {
    const { ui } = useStore();
    const { is_language_settings_modal_on, toggleLanguageSettingsModal } = ui;
    const { current_language } = useLanguageSettings();

    return (
        <React.Fragment>
            <a
                id='dt_language_settings_toggle'
                data-testid='dt_toggle_language_settings'
                onClick={toggleLanguageSettingsModal}
                className={classNames('ic-language', 'footer__link', {
                    'ic-settings--active': is_language_settings_modal_on,
                    'ic-settings--disabled': false,
                })}
            >
                <Popover alignment='top' message={localize('Language')} zIndex='9999'>
                    <Icon
                        icon={`IcFlag${current_language.replace('_', '-')}`}
                        data_testid='dt_icon'
                        className='ic-settings-language__icon'
                        size={18}
                    />
                    <Text weight='bold' size='xxs'>
                        <Localize i18n_default_text={current_language} />
                    </Text>
                </Popover>
            </a>
            <Modal
                id='dt_settings_modal'
                is_open={is_language_settings_modal_on}
                title={localize('Select Language')}
                toggleModal={toggleLanguageSettingsModal}
                width='616px'
                should_header_stick_body={false}
            >
                <LanguageSettings />
            </Modal>
        </React.Fragment>
    );
});

export { ToggleLanguageSettings };
