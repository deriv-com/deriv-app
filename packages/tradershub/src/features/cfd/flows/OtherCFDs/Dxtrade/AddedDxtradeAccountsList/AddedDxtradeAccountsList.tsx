import React, { Fragment } from 'react';
import { useActiveTradingAccount, useDxtradeAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv-com/ui';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';
import { CFDPlatforms, PlatformDetails } from '../../../../constants';
import { TopUpModal, TradeModal } from '../../../../modals';

const AddedDxtradeAccountsList = () => {
    const { data: dxTradeAccounts } = useDxtradeAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const { show } = Provider.useModal();
    const account = dxTradeAccounts?.find(account => account.is_virtual === activeTrading?.is_virtual);
    const isVirtual = account?.is_virtual;

    const leading = () => (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/derivx'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/derivx'));
                }
            }}
            role='button'
        >
            <DerivX />
        </div>
    );

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
        <TradingAccountCard leading={leading} trailing={trailing}>
            <div className='flex flex-col flex-grow'>
                {account && (
                    <Fragment>
                        <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
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
