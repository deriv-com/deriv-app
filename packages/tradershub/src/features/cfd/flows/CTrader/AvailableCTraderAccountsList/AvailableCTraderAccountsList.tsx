import React from 'react';
import { useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/cfd/ctrader.svg';
import { PlatformDetails } from '../../../constants';

const AvailableCTraderAccountsList = () => {
    const { mutate } = useCreateOtherCFDAccount();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const accountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: PlatformDetails.ctrader.platform,
            },
        });
    };

    const leadingIcon = () => (
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

    const trailingButton = () => (
        <Button className='rounded-200' colorStyle='coral' onClick={onSubmit} variant='primary'>
            Get
        </Button>
    );

    return (
        <div>
            <TradingAccountCard leading={leadingIcon} trailing={trailingButton}>
                <div className='flex flex-col flex-grow'>
                    <Text bold size='sm'>
                        {PlatformDetails.ctrader.title}
                    </Text>
                    <Text size='sm'>This account offers CFDs on a feature-rich trading platform.</Text>
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AvailableCTraderAccountsList;
