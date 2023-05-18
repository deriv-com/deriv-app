import React from 'react';
import WalletLinkWrapper from '../components/wallet-link/wallet-link-wrapper';
import './wallet-linking-step.scss';
import { Text, ThemedScrollbars } from '@deriv/components';

const WalletLinkingStep = () => {
    return (
        <div className='wallet-linking-step'>
            <Text as='div' className='wallet-linking-step__title' size='m' weight='bold'>
                Non-EU USD accounts
            </Text>
            <Text as='div' className='wallet-linking-step__description' size='s'>
                This is how we link your accounts with your new Wallet.
            </Text>
            <Text as='div' className='wallet-linking-step__description' size='xxs'>
                Your existing funds will remain in your trading account(s) and can be transferred to your Wallet after
                the upgrade.
            </Text>
            <div className='wallet-linking-step__title-wrapper'>
                <Text className='wallet-linking-step__title-text'>Your current trading account(s)</Text>
                <Text className='wallet-linking-step__title-text'>Your new Wallet(s)</Text>
            </div>
            <ThemedScrollbars className='wallet-linking-step__content'>
                <WalletLinkWrapper />
            </ThemedScrollbars>
        </div>
    );
};

export default WalletLinkingStep;
