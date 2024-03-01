import React, { useMemo, useState } from 'react';
import { AvailableP2PBalanceModal, DailyLimitModal } from '@/components/Modals';
import { useAdvertiserStats, useDevice } from '@/hooks';
import { numberToCurrencyText } from '@/utils';
import { useActiveAccount } from '@deriv/api-v2';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { MyProfileDailyLimit } from '../MyProfileDailyLimit';
import './MyProfileBalance.scss';

const MyProfileBalance = () => {
    const { data: advertiserInfo } = useAdvertiserStats();
    const { data: activeAccount } = useActiveAccount();
    const { isDesktop } = useDevice();
    const [shouldShowAvailableBalanceModal, setShouldShowAvailableBalanceModal] = useState(false);

    const currency = activeAccount?.currency || 'USD';
    const dailyLimits = useMemo(
        () => [
            {
                available: `${numberToCurrencyText(advertiserInfo?.dailyAvailableBuyLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserInfo?.daily_buy_limit || numberToCurrencyText(0)} ${currency}`,
                type: 'Buy',
            },
            {
                available: `${numberToCurrencyText(advertiserInfo?.dailyAvailableSellLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserInfo?.daily_sell_limit || numberToCurrencyText(0)} ${currency}`,
                type: 'Sell',
            },
        ],
        [
            advertiserInfo?.dailyAvailableBuyLimit,
            advertiserInfo?.dailyAvailableSellLimit,
            advertiserInfo?.daily_buy_limit,
            advertiserInfo?.daily_sell_limit,
            currency,
        ]
    );

    return (
        <>
            <AvailableP2PBalanceModal
                isModalOpen={shouldShowAvailableBalanceModal}
                onRequestClose={() => setShouldShowAvailableBalanceModal(false)}
            />
            <div className='p2p-v2-my-profile-balance'>
                <div className='p2p-v2-my-profile-balance__amount' data-testid='dt_p2p_v2_available_balance_amount'>
                    <div>
                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'xs'}>
                            Available Deriv P2P Balance
                        </Text>
                        <LabelPairedCircleInfoMdRegularIcon
                            className='cursor-pointer fill-gray-400'
                            data-testid='dt_p2p_v2_available_balance_icon'
                            onClick={() => setShouldShowAvailableBalanceModal(true)}
                        />
                    </div>
                    <Text size={isDesktop ? 'xl' : '2xl'} weight='bold'>
                        {numberToCurrencyText(advertiserInfo?.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
                    <div className='p2p-v2-my-profile-balance__items'>
                        {dailyLimits.map(({ available, dailyLimit, type }) => (
                            <div className='p2p-v2-my-profile-balance__item' key={type}>
                                <Text size={isDesktop ? 'sm' : 'xs'}>{type}</Text>
                                <div className='p2p-v2-my-profile-balance__item-limits'>
                                    <div data-testid={`dt_p2p_v2_profile_balance_daily_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'xs'}>
                                            Daily limit
                                        </Text>
                                        <Text
                                            className='p2p-v2-my-profile-balance__label'
                                            size={isDesktop ? 'sm' : 'md'}
                                            weight='bold'
                                        >
                                            {dailyLimit}
                                        </Text>
                                    </div>
                                    <div
                                        data-testid={`dt_p2p_v2_profile_balance_available_${type.toLowerCase()}_limit`}
                                    >
                                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'xs'}>
                                            Available
                                        </Text>
                                        <Text
                                            className='p2p-v2-my-profile-balance__label'
                                            size={isDesktop ? 'sm' : 'md'}
                                            weight='bold'
                                        >
                                            {available}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {advertiserInfo?.isEligibleForLimitUpgrade && (
                        <div className='w-fit'>
                            <MyProfileDailyLimit />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyProfileBalance;
