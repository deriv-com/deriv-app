import React, { Fragment, useState } from 'react';
import { Tabs, Tab, Text } from '@deriv-com/ui';
import { SentEmailContent } from '../../../../components';
import IcBackArrow from '../../../../public/images/ic-back-arrow.svg';
import { CFDPlatforms, PlatformDetails } from '../../constants';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const MT5ChangePasswordScreens = () => {
    const [showSentEmailContentWithoutTabs, setShowSentEmailContentWithoutTabs] = useState(false);
    const [, setTabNumber] = useState(0);

    const platform = CFDPlatforms.MT5;
    const { title } = PlatformDetails[platform];

    return showSentEmailContentWithoutTabs ? (
        <Fragment>
            <div
                className='flex content-center gap-400 self-start cursor-pointer'
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
                <Text weight='bold'>Back</Text>
            </div>

            <div className='mt-1600 w-full'>
                <SentEmailContent
                    description='Please click on the link in the email to reset your password.'
                    isInvestorPassword
                />
            </div>
        </Fragment>
    ) : (
        <Tabs className='w-[452px] md:w-full' variant='secondary'>
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
