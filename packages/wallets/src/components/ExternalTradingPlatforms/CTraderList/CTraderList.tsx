import React from 'react';
import { useCtraderAccountsList } from '@deriv/api';
import { AddedCTraderAccountsList } from '../AddedCTraderAccountsList';
import { AvailableCTraderAccountsList } from '../AvailableCTraderAccountsList';
import './CTraderList.scss';

const CTraderList: React.FC = () => {
    const { data } = useCtraderAccountsList();
    const hasCtraderAccount = !!data?.length;
    return (
        <div className='wallets-ctrader'>
            <div className='wallets-ctrader__title'>
                <h1>Deriv cTrader</h1>
            </div>
            <div className='wallets-ctrader__content'>
                {hasCtraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            </div>
        </div>
    );
};

export default CTraderList;
