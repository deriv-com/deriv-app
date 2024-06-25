import { Redirect } from 'react-router-dom';
import { UNSUPPORTED_LANGUAGES, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations, getAllowedLanguages } from '@deriv-com/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import LanguageRadioButton from '../../../Components/language-settings';
import { useEffect } from 'react';

const LanguageSettings = observer(() => {
    const { client, common, ui } = useStore();
    const { switchLanguage, currentLang, localize } = useTranslations();
    const { has_wallet } = client;
    // [TODO]: Remove changeSelectedLanguage() when whole app starts to use @deriv-com/translations
    const { changeSelectedLanguage, current_language } = common;

    const { is_mobile } = ui;

    // [TODO]: Remove useEffect() when whole app starts to use @deriv-com/translations
    // This is required to sync language state b/w footer language icon and Language settings
    useEffect(() => {
        switchLanguage(current_language);
    }, [current_language, switchLanguage]);

    if (is_mobile || has_wallet) {
        return <Redirect to={routes.traders_hub} />;
    }

    const allowed_languages: Record<string, string> = getAllowedLanguages(UNSUPPORTED_LANGUAGES);
    return (
        <div className='settings-language'>
            <FormSubHeader title={localize('Select Language')} />
            <div className='settings-language__language-container'>
                {Object.entries(allowed_languages).map(([language_key, value]) => {
                    return (
                        <LanguageRadioButton
                            key={language_key}
                            id={language_key}
                            language_text={value}
                            is_current_language={currentLang === language_key}
                            name='language-radio-group'
                            onChange={async () => {
                                // [TODO]: Remove changeSelectedLanguage() when whole app starts to use @deriv-com/translations
                                // This function also helps in informing language change to BE
                                await changeSelectedLanguage(language_key);
                                switchLanguage(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
