import { ChangeEventHandler } from 'react';
import { Text, Icon } from '@deriv/components';
import clsx from 'clsx';
import { TranslationFlag } from '@deriv/shared';

export type TLanguageRadioButton = {
    is_current_language: boolean;
    id: string;
    language_text: string;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

const LanguageRadioButton = ({ is_current_language, id, language_text, name, onChange }: TLanguageRadioButton) => {
    return (
        <div
            className={clsx('settings-language__language-link', {
                'settings-language__language-link--active': is_current_language,
            })}
            id={`dt_settings_${id}_button`}
            data-testid={'dt_language_settings_button'}
        >
            <input
                type='radio'
                id={id}
                name={name}
                onChange={onChange}
                value={id}
                className='settings-language__language--radio-button'
            />
            <label htmlFor={id} className='settings-language__language--center-label'>
                <div>
                    {TranslationFlag[id] ? (
                        TranslationFlag[id](36, 24)
                    ) : (
                        <Icon icon={`IcFlag${id}`} className='settings-language__language-flag' />
                    )}
                </div>
                <div>
                    <Text
                        size='xs'
                        className={clsx('settings-language__language-name', {
                            'settings-language__language-name--active': is_current_language,
                        })}
                    >
                        {language_text}
                    </Text>
                </div>
            </label>
        </div>
    );
};

export default LanguageRadioButton;
