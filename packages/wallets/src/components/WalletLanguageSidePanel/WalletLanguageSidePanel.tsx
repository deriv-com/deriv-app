import React from 'react';
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
    return (
        <div className='wallets-language-side-panel'>
            <WalletText color='general' size='lg' weight='bold'>
                Languages
            </WalletText>
            <ul className='wallets-language-side-panel__language-list'>
                {Object.keys(languages).map(language => {
                    const languageCode = languages[language as keyof typeof languages];
                    return (
                        <div
                            key={`wallets-language-side-panel__language-item-${languageCode}`}
                            onClick={() => {
                                setLanguage(languageCode);
                            }}
                        >
                            <li className='wallets-language-side-panel__language-item'>
                                <WalletText weight={i18n.language === languageCode ? 'bold' : 'normal'}>
                                    {language}
                                </WalletText>
                            </li>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
};

export default WalletLanguageSidePanel;
