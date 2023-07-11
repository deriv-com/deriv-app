import React, { ComponentProps } from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import { Language, getAllowedLanguages } from '@deriv/translations';

export type TLanguageLink = {
    is_active: boolean;
    icon_classname?: string;
    lang: Language;
} & ComponentProps<'div'>;

const LanguageLink = ({ icon_classname, is_active, lang, ...props }: TLanguageLink) => {
    const language_text = getAllowedLanguages()[lang];

    return (
        <div
            id={`dt_settings_${lang}_button`}
            className={classNames('settings-language__language-link', {
                'settings-language__language-link--active': is_active,
            })}
            {...props}
        >
            <Icon
                icon={`IcFlag${lang.replace('_', '-')}`}
                className={classNames(
                    'settings-language__language-link-flag',
                    'settings-language__language-flag',
                    icon_classname
                )}
            />
            <span
                className={classNames('settings-language__language-name', {
                    'settings-language__language-name--active': is_active,
                })}
            >
                {language_text}
            </span>
        </div>
    );
};

export default LanguageLink;
