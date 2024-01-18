import React, { Fragment } from 'react';
import { useActiveTradingAccount, useDxtradeAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';
import { CFDPlatforms, PlatformDetails } from '../../../../constants';
import { TradeModal } from '../../../../modals/TradeModal';

const AddedDxtradeAccountsList = () => {
    const { data: dxTradeAccounts } = useDxtradeAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const { show } = Provider.useModal();
    const account = dxTradeAccounts?.find(account => account.is_virtual === activeTrading?.is_virtual);

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
                className='border-opacity-black-400 rounded-200 px-800'
                colorStyle='black'
                variant='secondary'
            >
                Transfer
            </Button>
            <Button
                className='rounded-200 px-800'
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
                {dxTradeAccounts
                    ?.filter(account => account.is_virtual === activeTrading?.is_virtual)
                    ?.map(account => (
                        <Fragment key={account?.account_id}>
                            <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
                            <Text bold size='sm'>
                                {account?.display_balance}
                            </Text>
                            <Text color='primary' size='sm'>
                                {account?.login}
                            </Text>
                        </Fragment>
                    ))}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
