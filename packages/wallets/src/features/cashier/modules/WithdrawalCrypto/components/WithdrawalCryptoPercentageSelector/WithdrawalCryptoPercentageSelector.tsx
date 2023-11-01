import React from 'react';
import './WithdrawalCryptoPercentageSelector.scss';
import { WalletText } from '../../../../../../components';

const WithdrawalCryptoPercentageSelector = () => {
    return (
        <div className='wallets-withdrawal-crypto-percentage-selector'>
            <div className='wallets-withdrawal-crypto-percentage-selector__container'>
                <div className='wallets-withdrawal-crypto-percentage-selector__item'>
                    <WalletText as='div' size='sm'>
                        25%
                    </WalletText>
                    <div className='wallets-withdrawal-crypto-percentage-selector__button' />
                </div>
                <div className='wallets-withdrawal-crypto-percentage-selector__item'>
                    <WalletText as='div' size='sm'>
                        50%
                    </WalletText>
                    <div className='wallets-withdrawal-crypto-percentage-selector__button' />
                </div>
                <div className='wallets-withdrawal-crypto-percentage-selector__item'>
                    <WalletText as='div' size='sm'>
                        75%
                    </WalletText>
                    <div className='wallets-withdrawal-crypto-percentage-selector__button' />
                </div>
                <div className='wallets-withdrawal-crypto-percentage-selector__item'>
                    <WalletText as='div' size='sm'>
                        All
                    </WalletText>
                    <div className='wallets-withdrawal-crypto-percentage-selector__button' />
                </div>
            </div>
            <WalletText as='div' color='primary' size='xs'>
                0% of available balance (100.00000000 BTC)
            </WalletText>
        </div>
    );
};

export default WithdrawalCryptoPercentageSelector;
