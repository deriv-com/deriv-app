import React from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { THooks } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '../../flows/CTrader';

const CTraderList = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const hasCTraderAccount = cTraderAccounts?.some(
        (account: THooks.CtraderAccountsList) => account.is_virtual === activeTradingAccount?.is_virtual
    );

    return (
        <div className='border-solid border-b-xs border-b-system-light-hover-background pb-400 lg:border-none'>
            <Text bold className='pb-800'>
                {PlatformDetails.ctrader.title}
            </Text>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            </div>
        </div>
    );
};

export default CTraderList;
