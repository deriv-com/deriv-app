import React from 'react';
import { Text } from '@deriv/quill-design';
import { THooks, TPlatforms } from '../../../../types';
import { CFDPlatforms } from '../../constants';
import CompareAccountsButton from './CompareAccountsButton';
import CompareAccountsDescription from './CompareAccountsDescription';
import CompareAccountsPlatformLabel from './CompareAccountsPlatformLabel';
import CompareAccountsTitleIcon from './CompareAccountsTitleIcon';
import InstrumentsLabelHighlighted from './InstrumentsLabelHighlighted';

type TCompareAccountsCard = {
    isAccountAdded: boolean;
    isDemo: boolean;
    isEuRegion: boolean;
    isEuUser: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsCard = ({
    isAccountAdded,
    isDemo,
    isEuRegion,
    isEuUser,
    marketType,
    platform,
    shortCode,
}: TCompareAccountsCard) => {
    return (
        <div>
            <div className='w-[180px] lg:w-[270px] relative overflow-hidden rounded-1200 my-50 mx-500 border-solid border-75 border-system-light-hover-background bg-background-primary-base hover:shadow-230'>
                <CompareAccountsPlatformLabel platform={platform} />
                {platform === CFDPlatforms.CTRADER && (
                    <div className='p-75 lg:p-[15px] absolute z-10 flex items-center justify-center w-[150px] h-1000 bg-brand-orange text-system-light-primary-background translate-x-400 -translate-y-1000 rotate-45 lg:translate-x-[170px] transform'>
                        <Text bold className='text-system-light-primary-background' size='sm'>
                            New!
                        </Text>
                    </div>
                )}
                <CompareAccountsTitleIcon
                    isDemo={isDemo}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                <CompareAccountsDescription
                    isDemo={isDemo}
                    isEuRegion={isEuRegion}
                    marketType={marketType}
                    shortCode={shortCode}
                />
                <InstrumentsLabelHighlighted
                    isDemo={isDemo}
                    isEuRegion={isEuRegion}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                {isEuUser && (
                    <div className='relative text-center top-[5px]'>
                        <Text color='red' size='2xs' weight='bold'>
                            *Boom 300 and Crash 300 Index
                        </Text>
                    </div>
                )}
                <CompareAccountsButton
                    isAccountAdded={isAccountAdded}
                    //Removed for now as it is needed by Verification flow
                    // marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
            </div>
        </div>
    );
};

export default CompareAccountsCard;
