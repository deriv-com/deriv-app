import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getAllowedLanguages, useLanguageSettings } from '@deriv/translations';
import { LanguageLink } from 'App/Components/Routes';

const LanguageSettings = observer(() => {
    const { current_language } = useLanguageSettings();
    const { ui } = useStore();
    const { toggleLanguageSettingsModal } = ui;

    return (
        <div className='settings-language'>
            <div className='settings-language__language-container settings-language__language-container--has-padding'>
                {Object.keys(getAllowedLanguages()).map(lang =>
                    current_language === lang ? (
                        <LanguageLink key={lang} lang={lang} />
                    ) : (
                        <LanguageLink key={lang} is_clickable lang={lang} toggleModal={toggleLanguageSettingsModal} />
                    )
                )}
            </div>
        </div>
    );
});

export default LanguageSettings;
