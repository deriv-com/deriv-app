import React, { useMemo } from 'react';
import { TradingAccountCard } from '@/components';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import { THooks } from '@/types';
import { CFDPlatforms, MarketType, MarketTypeDetails } from '@cfd/constants';
import { useActiveTradingAccount, useJurisdictionStatus } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AddedMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { isEU } = useRegulationFlags();
    const { openModal } = useQueryParams();
    const { setCfdState } = useCFDContext();
    const { getVerificationStatus } = useJurisdictionStatus();
    const jurisdictionStatus = useMemo(
        () => getVerificationStatus(account.landing_company_short || 'svg', account.status),
        [account.landing_company_short, account.status, getVerificationStatus]
    );

    const isVirtual = account.is_virtual;
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const title = getCfdsAccountTitle(marketTypeDetails.title, activeTradingAccount?.is_virtual);

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='flex flex-col gap-y-4'>
                    <Button
                        color='black'
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() => {
                            if (isVirtual) {
                                setCfdState({
                                    account,
                                    platform: CFDPlatforms.MT5,
                                });
                                openModal('TopUpModal');
                            }
                            // else transferModal;
                        }}
                        variant='outlined'
                    >
                        {isVirtual ? 'Top up' : 'Transfer'}
                    </Button>
                    <Button
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() => {
                            setCfdState({
                                account,
                                marketType: account?.market_type,
                                platform: CFDPlatforms.MT5,
                            });
                            openModal('TradeModal');
                        }}
                    >
                        Open
                    </Button>
                </div>
            )}
        >
            <div className='flex-grow'>
                <div className='flex items-center self-stretch gap-8'>
                    <Text size='sm'>{title}</Text>
                    {!activeTradingAccount?.is_virtual && (
                        <div className='flex items-center h-24 gap-4 px-4 rounded-sm bg-system-light-secondary-background'>
                            <Text as='p' size='2xs' weight='bold'>
                                {account.landing_company_short?.toUpperCase()}
                            </Text>
                        </div>
                    )}
                </div>
                <div className='flex flex-col'>
                    {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                        <Text as='p' size='sm' weight='bold'>
                            {account.display_balance}
                        </Text>
                    )}
                    <Text size='sm'>{account.display_login}</Text>
                </div>
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
