import React from 'react';
import { AvailableCTraderAccountsList } from '../AvailableCTraderAccountsList';
import './CTraderList.scss';

const CTraderList: React.FC = () => {
    /** QA BOX NOT SETUP */
    // const { data } = useCtraderAccountsList();
    // const has_ctrader_account = !!data?.length;
    return (
        <div className='wallets-ctrader'>
            <div className='wallets-ctrader__title'>
                <h1>Deriv cTrader</h1>
            </div>
            <div className='wallets-ctrader__content'>
                <AvailableCTraderAccountsList />
            </div>
        </div>
    );
};

export default CTraderList;
