import React, { Fragment } from 'react';
import { useActiveTradingAccount, useDxtradeAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Text } from '@deriv/quill-design';
import { Button } from '@deriv-com/ui';
import { PlatformIcon, TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import { CFDPlatforms, PlatformDetails } from '../../../../constants';
import { TopUpModal, TradeModal } from '../../../../modals';

const LeadingIcon = () => (
    <PlatformIcon
        icon='DerivX'
        onClick={() => {
            window.open(getStaticUrl('/derivx'));
        }}
    />
);

const AddedDxtradeAccountsList = () => {
    const { data: dxTradeAccounts } = useDxtradeAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const { show } = Provider.useModal();
    const account = dxTradeAccounts?.find(account => account.is_virtual === activeTrading?.is_virtual);
    const isVirtual = account?.is_virtual;

    const trailing = () => (
        <div className='flex flex-col gap-y-200'>
            <Button
                // open transfer modal
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
                    <Fragment key={account?.account_id}>
                        <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
                        <Text bold size='sm'>
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
