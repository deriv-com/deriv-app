import React, { useEffect, useState } from 'react';
import i18n, { setLanguage } from '../../translations/i18n';
import { WalletText } from '../Base';
import './WalletLanguageSidePanel.scss';

const languages = {
    English: 'EN',
    German: 'DE',
    Indonesian: 'ID',
    Malay: 'MS',
};

const WalletLanguageSidePanel: React.FC = () => {
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        setLanguage(currentLanguage);
    }, [currentLanguage]);

    return (
        <div className='wallets-language-side-panel'>
            <WalletText color='general' size='lg' weight='bold'>
                Languages
            </WalletText>
            <ul className='wallets-language-side-panel__language-list'>
                {Object.keys(languages).map((language, index) => {
                    const languageCode = languages[language as keyof typeof languages];
                    return (
                        <li
                            className='wallets-language-side-panel__language-item'
                            key={index}
                            onClick={() => {
                                setCurrentLanguage(languageCode);
                            }}
                        >
                            <WalletText weight={currentLanguage === languageCode ? 'bold' : 'normal'}>
                                {language}
                            </WalletText>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default WalletLanguageSidePanel;
