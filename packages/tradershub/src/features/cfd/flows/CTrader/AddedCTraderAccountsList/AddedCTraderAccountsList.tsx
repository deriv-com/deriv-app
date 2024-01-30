import React, { Fragment } from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Text } from '@deriv/quill-design';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { PlatformIcon, TradingAccountCard } from '../../../../../components';
import { getStaticUrl } from '../../../../../helpers/urls';
import { CFDPlatforms, PlatformDetails } from '../../../constants';
import { TopUpModal, TradeModal } from '../../../modals';

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
        <div className='flex flex-col gap-y-200'>
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
                        <Fragment key={`added-ctrader-${account.login}`}>
                            <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                            <Text bold size='sm'>
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
