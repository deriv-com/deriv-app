import React from 'react';
import { useCtraderAccountsList } from '@deriv/api';
import { WalletText } from '../../../../components/Base';
import { PlatformDetails } from '../../constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '../../flows/CTrader';
import './CTraderList.scss';

const CTraderList: React.FC = () => {
    const { data } = useCtraderAccountsList();
    const hasCTraderAccount = !!data?.length;
    return (
        <div className='wallets-ctrader'>
            <WalletText weight='bold'>{PlatformDetails.ctrader.title}</WalletText>

            <div className='wallets-ctrader__content'>
                {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            </div>
        </div>
    );
};

export default CTraderList;
