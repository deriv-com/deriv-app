import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import Localize          from 'App/Components/Elements/localize.jsx';
import Icon              from 'Assets/icon.jsx';
import {
    getAllowedLanguages,
    getURL,
    currentLanguage }    from 'Utils/Language';

const isCurrentLanguage = (lang) => lang === currentLanguage;

const NonClickableLink = ({ children, lang }) => (
    <div className={classNames('settings-language__language-link', {
        'settings-language__language-link--active': isCurrentLanguage(lang),
    })}
    >
        {children}
    </div>
);

const LanguageLink = ({ lang }) => (
    <React.Fragment>
        <Icon
            icon='IconCountryFlag'
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

const LanguageSettings = () => (
    <div className='settings-language'>
        <div className='settings-language__language-header'>
            <span>
                <Localize i18n_default_text='Select language' />
            </span>
        </div>
        <div className='settings-language__language-container'>
            {Object.keys(getAllowedLanguages())
                .map(key => (
                    isCurrentLanguage(key) ?
                        <NonClickableLink lang={key} key={key}>
                            <LanguageLink lang={key} />
                        </NonClickableLink>
                        :
                        <a
                            key={key}
                            href={getURL(key)}
                            className={classNames('settings-language__language-link', {
                                'settings-language__language-link--active': isCurrentLanguage(key),
                            })}
                        >
                            <LanguageLink lang={key} key={key} />
                        </a>
                ))}
        </div>
    </div>
);

LanguageLink.propTypes = {
    lang: PropTypes.string,
};

NonClickableLink.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    lang: PropTypes.string,
};

export default LanguageSettings;
