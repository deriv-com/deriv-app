import React, { Fragment } from 'react';
import { IconComponent, TradingAccountCard } from '@/components';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useModal } from '@/providers';
import { CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { TopUpModal, TradeModal } from '@cfd/modals';
import { useActiveTradingAccount, useDxtradeAccountsList } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';

const { getDerivStaticURL } = URLUtils;

const LeadingIcon = () => (
    <IconComponent
        icon='DerivX'
        onClick={() => {
            window.open(getDerivStaticURL('/derivx'));
        }}
    />
);

const AddedDxtradeAccountsList = () => {
    const { data: dxTradeAccounts } = useDxtradeAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const { show } = useModal();
    const account = dxTradeAccounts?.find(account => account.is_virtual === activeTrading?.is_virtual);
    const isVirtual = account?.is_virtual;
    const title = getCfdsAccountTitle(PlatformDetails.dxtrade.title, isVirtual);

    const trailing = () => (
        <div className='flex flex-col gap-y-4'>
            <Button
                // open transfer modal
                color='black'
                onClick={() => {
                    if (isVirtual) show(<TopUpModal account={account} platform={CFDPlatforms.DXTRADE} />);
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
                            platform={CFDPlatforms.DXTRADE}
                        />
                    )
                }
            >
                Open
            </Button>
        </div>
    );

    return (
        <TradingAccountCard leading={LeadingIcon} trailing={trailing}>
            <div className='flex flex-col flex-grow'>
                {account && (
                    <Fragment>
                        <Text size='sm'>{title}</Text>
                        <Text size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text color='primary' size='sm'>
                            {account?.login}
                        </Text>
                    </Fragment>
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
