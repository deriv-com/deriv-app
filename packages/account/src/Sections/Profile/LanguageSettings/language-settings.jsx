import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DesktopWrapper, Icon } from '@deriv/components';
import { localize, getAllowedLanguages } from '@deriv/translations';
import { connect } from 'Stores/connect';
import FormSubHeader from 'Components/form-sub-header';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

const NonClickableLink = ({ children, lang }) => (
    <div
        id={`dt_settings_${lang}_button`}
        className={classNames('settings-language__language-link', {
            'settings-language__language-link--active': isCurrentLanguage(lang),
        })}
    >
        {children}
    </div>
);

const LanguageLink = ({ lang }) => (
    <React.Fragment>
        <Icon
            icon={`IcFlag${lang.replace('_', '-')}`}
            className={'settings-language__language-link-flag settings-language__language-flag'}
            type={lang.replace(/(\s|_)/, '-').toLowerCase()}
        />
        <span
            className={classNames('settings-language__language-name', {
                'settings-language__language-name--active': isCurrentLanguage(lang),
            })}
        >
            {getAllowedLanguages()[lang]}
        </span>
    </React.Fragment>
);

const LanguageSettings = ({ changeCurrentLanguage, current_language, toggleSettingsModal, changeLanguage }) => {
    const { i18n } = useTranslation();

    return (
        <div className='settings-language'>
            <DesktopWrapper>
                <FormSubHeader title={localize('Languages')} />
            </DesktopWrapper>
            <div className='settings-language__language-container'>
                {Object.keys(getAllowedLanguages()).map(key =>
                    isCurrentLanguage(key) ? (
                        <NonClickableLink lang={key} key={key}>
                            <LanguageLink lang={key} />
                        </NonClickableLink>
                    ) : (
                        <span
                            id={`dt_settings_${key}_button`}
                            key={key}
                            onClick={async () => {
                                await changeLanguage(key, changeCurrentLanguage);
                                await i18n.changeLanguage(key);
                                toggleSettingsModal();
                            }}
                            className={classNames('settings-language__language-link', {
                                'settings-language__language-link--active': isCurrentLanguage(key, current_language),
                            })}
                        >
                            <LanguageLink lang={key} key={key} />
                        </span>
                    )
                )}
            </div>
        </div>
    );
};

LanguageLink.propTypes = {
    lang: PropTypes.string,
};

NonClickableLink.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    lang: PropTypes.string,
};

export default connect(({ common, ui }) => ({
    changeCurrentLanguage: common.changeCurrentLanguage,
    current_language: common.current_language,
    toggleSettingsModal: ui.toggleSettingsModal,
    changeLanguage: common.changeLanguage,
}))(LanguageSettings);
