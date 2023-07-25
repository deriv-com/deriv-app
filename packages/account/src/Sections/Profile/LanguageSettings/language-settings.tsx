import React from 'react';
import { Formik, FormikHandlers, FormikHelpers, FormikValues } from 'formik';
import { Button, DesktopWrapper } from '@deriv/components';
import { localize, useLanguageChecks, useLanguageSettings, LanguageKey } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import FormFooter from 'Components/form-footer';
import LanguageRadioButton from 'Components/language-settings';

const LanguageSettings = () => {
    const { is_loading, current_language, handleChangeLanguage } = useLanguageSettings();
    const { allowed_languages } = useLanguageChecks();

    return (
        <Formik
            initialValues={{ language_code: current_language }}
            onSubmit={values => handleChangeLanguage(values.language_code)}
        >
            {({ handleSubmit, setFieldValue, values }: FormikHandlers & FormikHelpers<FormikValues> & FormikValues) => {
                return (
                    <form onSubmit={handleSubmit} className='account-form account-form--language-settings'>
                        <div className='settings-language'>
                            <DesktopWrapper>
                                <FormSubHeader title={localize('Select Language')} />
                            </DesktopWrapper>
                            <div className='settings-language__language-container'>
                                {Object.keys(allowed_languages).map(language_key => {
                                    return (
                                        <LanguageRadioButton
                                            key={language_key}
                                            id={language_key}
                                            language_code={language_key as LanguageKey}
                                            is_current_language={values.language_code === language_key}
                                            name='language-radio-group'
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                setFieldValue('language_code', event.target.value)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <FormFooter>
                            <Button
                                className='account-form__footer-btn'
                                type='submit'
                                data-testid={'submit-button'}
                                has_effect
                                text={localize('Submit')}
                                large
                                primary
                                is_disabled={current_language === values.language_code || is_loading}
                            />
                        </FormFooter>
                    </form>
                );
            }}
        </Formik>
    );
};

export default LanguageSettings;
