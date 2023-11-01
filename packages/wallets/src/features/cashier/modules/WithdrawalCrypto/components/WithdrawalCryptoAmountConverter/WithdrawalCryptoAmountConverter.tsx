import React from 'react';
import './WithdrawalCryptoAmountConverter.scss';
import { WalletTextField } from '../../../../../../components';
import ArrowBold from '../../../../../../public/images/arrow-bold.svg';

const WithdrawalCryptoAmountConverter = () => {
    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <WalletTextField label='Amount (BTC)' />
            <div className='wallets-withdrawal-crypto-amount-converter__arrow'>
                <ArrowBold />
            </div>
            <WalletTextField helperMessage='Approximate value' label='Amount (USD)' showMessage />
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
