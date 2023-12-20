import React from 'react';
import { useCtraderAccountsList } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/cfd/ctrader.svg';
import { PlatformDetails } from '../../../constants';

const AddedCTraderAccountsList: React.FC = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();

    const leading = () => (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/deriv-ctrader'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/deriv-ctrader'));
                }
            }}
        >
            <CTrader />
        </div>
    );

    const trailing = () => (
        <div className='flex flex-col space-y-1'>
            <Button
                // todo: open transfer modal
                variant='outlined'
            >
                Transfer
            </Button>
            <Button>Open</Button>
        </div>
    );

    return (
        <div>
            <TradingAccountCard leading={leading} trailing={trailing}>
                <div className='flex flex-col flex-grow'>
                    {cTraderAccounts?.map(account => (
                        <React.Fragment key={`added-ctrader-${account.login}`}>
                            <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                            <Text size='sm' weight='bold'>
                                {account?.formatted_balance}
                            </Text>
                            <Text color='primary' size='sm' weight='bold'>
                                {account.login}
                            </Text>
                        </React.Fragment>
                    ))}
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AddedCTraderAccountsList;
