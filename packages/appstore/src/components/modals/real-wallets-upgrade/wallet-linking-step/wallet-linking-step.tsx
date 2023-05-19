import React from 'react';
import WalletLinkWrapper from '../components/wallet-link/wallet-link-wrapper';
import './wallet-linking-step.scss';
import { Text, ThemedScrollbars } from '@deriv/components';

type TWalletLinkingStep = {
    title: string;
};

const WalletLinkingStep = ({ title }: TWalletLinkingStep) => {
    return (
        <div className='wallet-linking-step'>
            <Text as='div' className='wallet-linking-step__page-title' weight='bold'>
                {title}
            </Text>
            <Text as='div' className='wallet-linking-step__description' size='s'>
                This is how we link your accounts with your new Wallet.
            </Text>
            <Text as='span' className='wallet-linking-step__note wallet-linking-step__title-text' size='xxs'>
                Your existing funds will remain in your trading account(s) and can be transferred to your Wallet after
                the upgrade.
            </Text>
            <div className='wallet-linking-step__title-small'>
                <Text className='wallet-linking-step__title-text wallet-linking-step__title-small-text' size='xxxs'>
                    Your current trading account(s)
                </Text>
                <Text className='wallet-linking-step__title-text wallet-linking-step__title-small-text' size='xxxs'>
                    Your new Wallet(s)
                </Text>
            </div>
            <ThemedScrollbars className='wallet-linking-step__content'>
                <WalletLinkWrapper />
                {/* <WalletLinkWrapper /> */}
            </ThemedScrollbars>
        </div>
    );
};

export default WalletLinkingStep;
