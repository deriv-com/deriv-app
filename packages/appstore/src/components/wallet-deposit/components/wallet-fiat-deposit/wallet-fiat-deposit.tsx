import React from 'react';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';

const WalletFiatDeposit = () => {
    return (
        <div className='wallet-deposit__fiat-container'>
            <DepositFiatIframe />
        </div>
    );
};

export default WalletFiatDeposit;
