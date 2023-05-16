import React from 'react';
import { Text } from '@deriv/components';
import { WalletAccount } from '../wallet-account';
import './wallets-linking-step.scss';

const WalletsLinkingStep = () => {
    return (
        <div className='wallet-linking-step'>
            <div className='wallet-linking-step__accounts'>
                <div className='wallet-linking-step__accounts-title'>
                    <Text className='wallet-linking-step__accounts-title-text' size='xxxs'>
                        Your current trading account(s)
                    </Text>
                </div>
                <div className='wallet-linking-step__accounts-list'>
                    <div className='wallet-linking-step__accounts-list-container'>
                        <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                        <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                        <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                        <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                        <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                        <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    </div>
                    <div className='wallet-linking-step__accounts-list-bracket' />
                </div>
            </div>
            kbkjb
        </div>
    );
};

export default WalletsLinkingStep;
