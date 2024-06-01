import { Redirect } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, getAllowedLanguages } from '@deriv/translations';
import { useTranslations } from '@deriv-com/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import LanguageRadioButton from '../../../Components/language-settings';

const LanguageSettings = observer(() => {
    const { client, common, ui } = useStore();
    const { switchLanguage, currentLang } = useTranslations();
    const { has_wallet } = client;
    const { changeSelectedLanguage } = common;
    const { is_mobile } = ui;

    if (is_mobile || has_wallet) {
        return <Redirect to={routes.traders_hub} />;
    }

    const allowed_languages: Record<string, string> = getAllowedLanguages();
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
                            onChange={() => {
                                switchLanguage(language_key);
                                // [TODO]: Remove this function when whole app starts to use @deriv-com/translations
                                changeSelectedLanguage(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
