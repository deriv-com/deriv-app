import React from 'react';
import { Text } from '@deriv-com/ui';
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
            <div className='w-[180px] lg:w-[270px] relative overflow-hidden rounded-[24px] my-0 mx-10 border-solid border-1 border-system-light-hover-background hover:shadow-7 text-center flex flex-col justify-between h-full'>
                <CompareAccountsPlatformLabel platform={platform} />
                {platform === CFDPlatforms.CTRADER && (
                    <div className='p-1 lg:p-[15px] absolute z-10 flex items-center justify-center w-[150px] h-20 bg-brand-orange text-system-light-primary-background translate-x-8 -translate-y-20 rotate-45 lg:translate-x-[170px] transform'>
                        <Text className='text-system-light-primary-background' size='sm' weight='bold'>
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
