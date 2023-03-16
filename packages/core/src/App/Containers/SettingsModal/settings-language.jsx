import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { Localize, getAllowedLanguages } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { LanguageLink } from 'App/Components/Routes';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

const LanguageSettings = ({ current_language, is_pre_appstore, toggleLanguageSettingsModal, toggleSettingsModal }) => {
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
};

export default connect(({ client, common, ui }) => ({
    changeCurrentLanguage: common.changeCurrentLanguage,
    current_language: common.current_language,
    is_pre_appstore: client.is_pre_appstore,
    toggleLanguageSettingsModal: ui.toggleLanguageSettingsModal,
    toggleSettingsModal: ui.toggleSettingsModal,
}))(LanguageSettings);
