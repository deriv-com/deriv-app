import React from 'react';
import { Text, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import WalletLinkWrapper, { TWalletLinkWrapper } from '../components/wallet-link/wallet-link-wrapper';
import './wallet-linking-step.scss';

type TWalletLinkingStep = {
    data: { title: string; currency: string; landing_company_name: string; wallets: Array<TWalletLinkWrapper> };
};

const WalletLinkingStep = ({ data }: TWalletLinkingStep) => {
    return (
        <div className='wallet-linking-step'>
            <Text as='div' className='wallet-linking-step__page-title' weight='bold'>
                {data.title}
            </Text>
            <Text as='div' className='wallet-linking-step__description' size='s'>
                {localize('This is how we link your accounts with your new Wallet.')}
            </Text>
            <Text as='span' className='wallet-linking-step__note wallet-linking-step__title-text' size='xxs'>
                {localize(
                    'Your existing funds will remain in your trading account(s) and can be transferred to your Wallet after the upgrade.'
                )}
            </Text>
            <div className='wallet-linking-step__title-small'>
                <Text className='wallet-linking-step__title-text wallet-linking-step__title-small-text' size='xxxs'>
                    {localize('Your current trading account(s)')}
                </Text>
                <Text className='wallet-linking-step__title-text wallet-linking-step__title-small-text' size='xxxs'>
                    {localize('Your new Wallet(s)')}
                </Text>
            </div>
            <ThemedScrollbars className='wallet-linking-step__content'>
                {data.wallets.map((wallet, index) => {
                    return (
                        <WalletLinkWrapper
                            key={index}
                            account_list={wallet.account_list}
                            wallet_details={wallet.wallet_details}
                        />
                    );
                })}
            </ThemedScrollbars>
        </div>
    );
};

export default WalletLinkingStep;
