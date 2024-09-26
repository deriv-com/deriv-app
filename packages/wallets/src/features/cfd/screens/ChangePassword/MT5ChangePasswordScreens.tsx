import React, { useState } from 'react';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { SentEmailContent } from '../../../../components';
import { Tab, Tabs } from '../../../../components/Base';
import { PlatformDetails } from '../../constants';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const MT5ChangePasswordScreens = () => {
    const [showSentEmailContentWithoutTabs, setShowSentEmailContentWithoutTabs] = useState(false);
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const platform = PlatformDetails.mt5.platform;
    const { title } = PlatformDetails[platform];

    return showSentEmailContentWithoutTabs ? (
        <div
            className='wallets-change-password__sent-email-content-wrapper--mt5-investor'
            data-testid='dt_change_password_sent_email_content_wrapper'
        >
            <SentEmailContent
                description={localize('Please click on the link in the email to reset your password.')}
                isInvestorPassword
            />
        </div>
    ) : (
        <Tabs fontSize={isDesktop ? 'sm' : 'md'} preSelectedTab={0} wrapperClassName='wallets-change-password__tab'>
            <Tab title={localize('{{title}} Password', { title })}>
                <TradingPlatformChangePasswordScreens platform={platform} />
            </Tab>
            <Tab title={localize('Investor Password')}>
                <MT5ChangeInvestorPasswordScreens setShowEmailSentScreen={setShowSentEmailContentWithoutTabs} />
            </Tab>
        </Tabs>
    );
};

export default MT5ChangePasswordScreens;
