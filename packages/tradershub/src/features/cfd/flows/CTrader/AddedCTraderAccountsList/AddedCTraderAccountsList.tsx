import React, { Fragment } from 'react';
import { PlatformIcon, TradingAccountCard } from '@/components';
import { getStaticUrl } from '@/helpers';
import { CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { TopUpModal, TradeModal } from '@cfd/modals';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv-com/ui';

const LeadingIcon = () => (
    <PlatformIcon
        icon='CTrader'
        onClick={() => {
            window.open(getStaticUrl('/deriv-ctrader'));
        }}
    />
);

const AddedCTraderAccountsList = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const { show } = Provider.useModal();
    const account = cTraderAccounts?.find(account => account.is_virtual === activeTrading?.is_virtual);
    const isVirtual = account?.is_virtual;

    const trailing = () => (
        <div className='flex flex-col gap-y-4'>
            <Button
                // todo: open transfer modal
                onClick={() => {
                    if (isVirtual) show(<TopUpModal account={account} platform={CFDPlatforms.CTRADER} />);
                    // else transferModal;
                }}
                variant='outlined'
            >
                {isVirtual ? 'Top up' : 'Transfer'}
            </Button>
            <Button
                onClick={() =>
                    account &&
                    show(
                        <TradeModal
                            account={account}
                            marketType={account?.market_type}
                            platform={CFDPlatforms.CTRADER}
                        />
                    )
                }
            >
                Open
            </Button>
        </div>
    );

    return (
        <div>
            <TradingAccountCard leading={LeadingIcon} trailing={trailing}>
                <div className='flex flex-col flex-grow'>
                    {account && (
                        <Fragment>
                            <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                            <Text size='sm' weight='bold'>
                                {account?.formatted_balance}
                            </Text>
                            <Text color='primary' size='sm'>
                                {account.login}
                            </Text>
                        </Fragment>
                    )}
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AddedCTraderAccountsList;
