import React, { useState } from 'react';
import { SentEmailContent } from '../../../../components';
import { Tab, Tabs } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { PlatformDetails } from '../../constants';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const MT5ChangePasswordScreens = () => {
    const [showSentEmailContentWithoutTabs, setShowSentEmailContentWithoutTabs] = useState(false);
    const { isMobile } = useDevice();

    const platform = PlatformDetails.mt5.platform;
    const { title } = PlatformDetails[platform];

    return showSentEmailContentWithoutTabs ? (
        <div className='wallets-change-password__sent-email-content-wrapper--mt5-investor'>
            <SentEmailContent
                description='Please click on the link in the email to reset your password.'
                isInvestorPassword
            />
        </div>
    ) : (
        <Tabs fontSize={isMobile ? 'md' : 'sm'} preSelectedTab={0} wrapperClassName='wallets-change-password__tab'>
            <Tab title={`${title} Password`}>
                <TradingPlatformChangePasswordScreens platform={platform} />
            </Tab>
            <Tab title='Investor Password'>
                <MT5ChangeInvestorPasswordScreens setShowEmailSentScreen={setShowSentEmailContentWithoutTabs} />
            </Tab>
        </Tabs>
    );
};

export default MT5ChangePasswordScreens;
