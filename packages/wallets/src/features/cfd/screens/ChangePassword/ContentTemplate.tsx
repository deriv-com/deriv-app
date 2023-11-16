import React from 'react';
import { WalletText } from '../../../../components/Base';

interface ContentTemplateProps {
    bodyText: React.ReactNode;
    button: React.ReactNode;
    headingText: string;
    icon: React.ReactNode;
}

const ContentTemplate: React.FC<ContentTemplateProps> = ({ bodyText, button, headingText, icon }) => (
    <>
        <div className='change-password__content__icon'>{icon}</div>
        <div className='wallets-change-password__content__text'>
            <WalletText align='center' weight='bold'>
                {headingText}
            </WalletText>
            {bodyText}
        </div>
        <div className='wallets-change-password__content__btn'>{button}</div>
    </>
);

export default ContentTemplate;
