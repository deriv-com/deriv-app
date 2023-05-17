import React from 'react';
import { Icon, Text } from '@deriv/components';
import { WalletAccount } from '../wallet-account';
import './wallet-link.scss';

const WalletLink = () => {
    return (
        <div className='wallet-link'>
            <div className='wallet-link__title-wrapper'>
                <Text className='wallet-link__title-text'>Your current trading account(s)</Text>
                <Text className='wallet-link__title-text'>Your new Wallet(s)</Text>
            </div>
            <div className='wallet-link__content'>
                <div className='wallet-link__content-accounts'>
                    <Text className='wallet-link__title-text wallet-link__content-accounts-title'>
                        Your current trading account(s)
                    </Text>
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                    <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                </div>
                <div className='wallet-link__content-link'>
                    <div className='wallet-link__content-link-bracket' />
                    <div className='wallet-link__content-link-icon'>
                        <Icon icon='IcAppstoreWalletsLink' size={40} />
                    </div>
                </div>
                <div className='wallet-link__content-card-wrapper'>
                    <Text className='wallet-link__title-text wallet-link__content-card-wrapper-title'>
                        Your new Wallet
                    </Text>
                    <div className='wallet-link__content-card' />
                </div>
            </div>
        </div>
    );
};

export default WalletLink;
