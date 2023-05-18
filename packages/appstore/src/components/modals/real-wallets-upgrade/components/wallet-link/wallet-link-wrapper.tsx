import React from 'react';
import { Icon, Text } from '@deriv/components';
import WalletAccount from '../wallet-account/wallet-account';
import './wallet-link-wrapper.scss';

const WalletLinkWrapper = () => {
    return (
        <div className='wallet-link-wrapper'>
            <div className='wallet-link-wrapper__accounts'>
                <Text className='wallet-link-wrapper__title-text wallet-link-wrapper__accounts-title'>
                    Your current trading account(s)
                </Text>
                <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
                <WalletAccount balance='0.00' currency='USD' icon='IcCurrencyUsd' name='MT5 Derived SVG' />
            </div>
            <div className='wallet-link-wrapper__link'>
                <div className='wallet-link-wrapper__link-bracket' />
                <div className='wallet-link-wrapper__link-icon'>
                    <Icon icon='IcAppstoreWalletsLink' size={40} />
                </div>
            </div>
            <div className='wallet-link-wrapper__card-wrapper'>
                <Text className='wallet-link-wrapper__title-text wallet-link-wrapper__card-wrapper-title'>
                    Your new Wallet
                </Text>
                <div className='wallet-link-wrapper__card' />
            </div>
        </div>
    );
};

export default WalletLinkWrapper;
