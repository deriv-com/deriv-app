import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, getAllowedLanguages } from '@deriv/translations';
import { LanguageLink } from 'App/Components/Routes';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

const LanguageSettings = observer(() => {
    const { client, common, ui } = useStore();
    const { current_language } = common;
    const { toggleLanguageSettingsModal, toggleSettingsModal } = ui;
    const { is_pre_appstore } = client;

    return (
        <div className='settings-language'>
            {!is_pre_appstore && (
                <div className='settings-language__language-header'>
                    <Text size='xs' color='prominent' weight='bold'>
                        <Localize i18n_default_text='Select language' />
                    </Text>
                </div>
            )}
            <div
                className={classNames('settings-language__language-container', {
                    'settings-language__language-container--pre-appstore': is_pre_appstore,
                })}
            >
                {Object.keys(getAllowedLanguages()).map(lang =>
                    isCurrentLanguage(lang, current_language) ? (
                        <LanguageLink key={lang} lang={lang} />
                    ) : (
                        <LanguageLink
                            key={lang}
                            is_clickable
                            lang={lang}
                            toggleModal={is_pre_appstore ? toggleLanguageSettingsModal : toggleSettingsModal}
                        />
                    )
                )}
            </div>
        </div>
    );
});

export default LanguageSettings;
