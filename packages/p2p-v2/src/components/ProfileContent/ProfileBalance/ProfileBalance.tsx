import React, { useMemo, useState } from 'react';
import { TAdvertiserStats } from 'types';
import { AvailableP2PBalanceModal } from '@/components/Modals';
import { useDevice } from '@/hooks';
import { numberToCurrencyText } from '@/utils';
import { useActiveAccount } from '@deriv/api-v2';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { ProfileDailyLimit } from '../ProfileDailyLimit';
import './ProfileBalance.scss';

const ProfileBalance = ({ advertiserStats }: { advertiserStats: TAdvertiserStats }) => {
    const { data: activeAccount } = useActiveAccount();
    const { isDesktop } = useDevice();
    const [shouldShowAvailableBalanceModal, setShouldShowAvailableBalanceModal] = useState(false);

    const currency = activeAccount?.currency || 'USD';
    const dailyLimits = useMemo(
        () => [
            {
                available: `${numberToCurrencyText(advertiserStats?.dailyAvailableBuyLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserStats?.daily_buy_limit || numberToCurrencyText(0)} ${currency}`,
                type: 'Buy',
            },
            {
                available: `${numberToCurrencyText(advertiserStats?.dailyAvailableSellLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserStats?.daily_sell_limit || numberToCurrencyText(0)} ${currency}`,
                type: 'Sell',
            },
        ],
        [
            advertiserStats?.dailyAvailableBuyLimit,
            advertiserStats?.dailyAvailableSellLimit,
            advertiserStats?.daily_buy_limit,
            advertiserStats?.daily_sell_limit,
            currency,
        ]
    );

    return (
        <>
            <AvailableP2PBalanceModal
                isModalOpen={shouldShowAvailableBalanceModal}
                onRequestClose={() => setShouldShowAvailableBalanceModal(false)}
            />
            <div className='p2p-v2-profile-balance'>
                <div className='p2p-v2-profile-balance__amount' data-testid='dt_p2p_v2_available_balance_amount'>
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
                        {numberToCurrencyText(advertiserStats?.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
                    <div className='p2p-v2-profile-balance__items'>
                        {dailyLimits.map(({ available, dailyLimit, type }) => (
                            <div className='p2p-v2-profile-balance__item' key={type}>
                                <Text size={isDesktop ? 'sm' : 'xs'}>{type}</Text>
                                <div className='p2p-v2-profile-balance__item-limits'>
                                    <div data-testid={`dt_p2p_v2_profile_balance_daily_${type.toLowerCase()}_limit`}>
                                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'xs'}>
                                            Daily limit
                                        </Text>
                                        <Text
                                            className='p2p-v2-profile-balance__label'
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
                                            className='p2p-v2-profile-balance__label'
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
                    {advertiserStats?.isEligibleForLimitUpgrade && (
                        <div className='w-fit'>
                            <ProfileDailyLimit />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileBalance;
