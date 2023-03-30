import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getAllowedLanguages } from '@deriv/translations';
import { LanguageLink } from 'App/Components/Routes';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

const LanguageSettings = observer(() => {
    const { common, ui } = useStore();
    const { current_language } = common;
    const { toggleLanguageSettingsModal } = ui;

    return (
        <div className='settings-language'>
            <div className='settings-language__language-container--pre-appstore'>
                {Object.keys(getAllowedLanguages()).map(lang =>
                    isCurrentLanguage(lang, current_language) ? (
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
