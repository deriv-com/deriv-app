import React, { Fragment, useState } from 'react';
import { SentEmailContent } from '../../../../components';
import { Tab, Tabs, WalletText } from '../../../../components/Base';
import IcBackArrow from '../../../../public/images/ic-back-arrow.svg';
import { TPlatforms } from '../../../../types';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

type TProps = {
    platform: TPlatforms.All;
    title: string;
};

const MT5ChangePasswordScreens: React.FC<TProps> = ({ platform, title }) => {
    const [showSentEmailContentWithoutTabs, setShowSentEmailContentWithoutTabs] = useState(false);
    const [tabNumber, setTabNumber] = useState(0);

    return showSentEmailContentWithoutTabs ? (
        <Fragment>
            <div
                className='wallets-change-password__back-arrow'
                onClick={() => {
                    setShowSentEmailContentWithoutTabs(false);
                    setTabNumber(1);
                }}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        setShowSentEmailContentWithoutTabs(false);
                        setTabNumber(1);
                    }
                }}
            >
                <IcBackArrow />
                <WalletText weight='bold'>Back</WalletText>
            </div>

            <div className='wallets-change-investor-password-screens__sent-email-wrapper'>
                <SentEmailContent
                    description='Please click on the link in the email to reset your password.'
                    isInvestorPassword
                />
            </div>
        </Fragment>
    ) : (
        <Tabs preSelectedTab={tabNumber} wrapperClassName='wallets-change-password__tab'>
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
