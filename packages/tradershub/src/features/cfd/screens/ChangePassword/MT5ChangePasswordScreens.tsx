import React, { Fragment, useState } from 'react';
import IcBackArrow from '@/assets/svgs/ic-back-arrow.svg';
import { SentEmailContent } from '@/components';
import { useCFDContext } from '@/providers';
import { Tab, Tabs, Text } from '@deriv-com/ui';
import { CFDPlatforms, PlatformDetails } from '../../constants';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const MT5ChangePasswordScreens = () => {
    const [showSentEmailContentWithoutTabs, setShowSentEmailContentWithoutTabs] = useState(false);
    const [, setTabNumber] = useState(0);
    const { setCfdState } = useCFDContext();

    const platform = CFDPlatforms.MT5;
    const { title } = PlatformDetails[platform];

    return showSentEmailContentWithoutTabs ? (
        <Fragment>
            <div
                className='flex content-center self-start gap-8 cursor-pointer'
                onClick={() => {
                    setCfdState({
                        description: 'Please click on the link in the email to reset your password.',
                        isInvestorPassword: true,
                    });
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

            <div className='w-full mt-32'>
                <SentEmailContent />
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
