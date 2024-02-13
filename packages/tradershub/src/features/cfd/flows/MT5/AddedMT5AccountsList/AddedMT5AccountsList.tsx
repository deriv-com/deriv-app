import React, { useMemo } from 'react';
import { TradingAccountCard } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { THooks } from '@/types';
import { CFDPlatforms, MarketType, MarketTypeDetails } from '@cfd/constants';
import { TopUpModal, TradeModal } from '@cfd/modals';
import { useActiveTradingAccount, useJurisdictionStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv-com/ui';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AddedMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { isEU } = useRegulationFlags();

    const { show } = Provider.useModal();
    const { getVerificationStatus } = useJurisdictionStatus();
    const jurisdictionStatus = useMemo(
        () => getVerificationStatus(account.landing_company_short || 'svg', account.status),
        [account.landing_company_short, account.status, getVerificationStatus]
    );

    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];

    const title = marketTypeDetails?.title;
    const isVirtual = account.is_virtual;

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='flex flex-col gap-y-4'>
                    <Button
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() => {
                            if (isVirtual) show(<TopUpModal account={account} platform={CFDPlatforms.MT5} />);
                            // else transferModal;
                        }}
                        variant='outlined'
                    >
                        {isVirtual ? 'Top up' : 'Transfer'}
                    </Button>
                    <Button
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() =>
                            show(
                                <TradeModal
                                    account={account}
                                    marketType={account?.market_type}
                                    platform={CFDPlatforms.MT5}
                                />
                            )
                        }
                    >
                        Open
                    </Button>
                </div>
            )}
        >
            <div className='flex-grow'>
                <div className='flex items-center self-stretch gap-8'>
                    <Text size='sm'>{title}</Text>
                    {!activeAccount?.is_virtual && (
                        <div className='flex items-center h-24 gap-4 px-4 rounded-sm bg-system-light-secondary-background'>
                            <Text as='p' size='2xs' weight='bold'>
                                {account.landing_company_short?.toUpperCase()}
                            </Text>
                        </div>
                    )}
                </div>
                <div className='flex flex-col'>
                    {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                        <Text size='sm' weight='bold'>
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
