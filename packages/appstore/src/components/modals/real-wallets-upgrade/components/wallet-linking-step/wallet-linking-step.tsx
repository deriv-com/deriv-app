import React from 'react';
import { Icon, Text, ThemedScrollbars, WalletCard } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletAccount from '../wallet-account/wallet-account';
import WalletLinkWrapper from '../wallet-link/wallet-link-wrapper';
import './wallet-linking-step.scss';
import { ArrayElement } from 'Types';

type TWalletLinkingStep = {
    data: {
        title: string;
        wallets: Array<{
            wallet_details: React.ComponentProps<typeof WalletCard>['wallet'];
            account_list: {
                balance: number;
                currency: string;
                account_name: string;
                icon: string;
            }[];
        }>;
    };
};

const LinkedAccountList = ({
    wallet,
    is_mobile,
}: {
    wallet: ArrayElement<TWalletLinkingStep['data']['wallets']>;
    is_mobile: boolean;
}) => {
    return (
        <>
            {is_mobile && (
                <Text
                    as='div'
                    className='wallet-linking-step__title-text wallet-linking-step__accounts-text '
                    color='prominent'
                    size='xxxs'
                >
                    <Localize i18n_default_text='Your current trading account(s)' />
                </Text>
            )}
            {wallet.account_list.map(account => {
                return (
                    <WalletAccount
                        key={`${account.account_name}-${account.currency}}`}
                        balance={account.balance}
                        currency={account.currency}
                        icon={account.icon}
                        name={account.account_name}
                        is_mobile={is_mobile}
                    />
                );
            })}
        </>
    );
};

const LinkedWallet = ({
    wallet,
    is_mobile,
}: {
    wallet: ArrayElement<TWalletLinkingStep['data']['wallets']>;
    is_mobile: boolean;
}) => {
    return (
        <div style={{ height: '13.6rem', position: 'relative' }}>
            <WalletCard wallet={wallet.wallet_details} size='large' state='default' />
            {is_mobile && (
                <Text
                    className='wallet-linking-step__title-text wallet-linking-step__wallet-card-text'
                    color='prominent'
                    size='xxxs'
                >
                    <Localize i18n_default_text='Your new Wallet' />
                </Text>
            )}
        </div>
    );
};

const WalletLinkingStep = observer(({ data }: TWalletLinkingStep) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='wallet-linking-step'>
            <Text as='div' color='prominent' size={is_mobile ? 's' : 'm'} weight='bold'>
                {data.title}
            </Text>
            <Text as='div' className='wallet-linking-step__description' color='prominent' size={is_mobile ? 'xs' : 's'}>
                <Localize i18n_default_text='This is how we link your accounts with your new Wallet.' />
            </Text>
            <Text
                as='span'
                className='wallet-linking-step__note wallet-linking-step__title-text'
                color='prominent'
                size='xxs'
            >
                <Localize i18n_default_text='Your existing funds will remain in your trading account(s) and can be transferred to your Wallet after the upgrade.' />
            </Text>
            {!is_mobile && (
                <div className='wallet-linking-step__title'>
                    <Text className='wallet-linking-step__title-text' color='prominent' size='xxxs'>
                        <Localize i18n_default_text='Your current trading account(s)' />
                    </Text>
                    <Text className='wallet-linking-step__title-text' color='prominent' size='xxxs'>
                        <Localize i18n_default_text='Your new Wallet(s)' />
                    </Text>
                </div>
            )}
            <ThemedScrollbars className='wallet-linking-step__content'>
                {data.wallets.map(wallet => {
                    return (
                        <WalletLinkWrapper
                            key={wallet.wallet_details.name}
                            has_left_fork={wallet.account_list.length > 1 || is_mobile}
                            left={() => <LinkedAccountList wallet={wallet} is_mobile={is_mobile} />}
                            center={() => <Icon icon='IcAppstoreWalletsLink' size={40} />}
                            right={() => <LinkedWallet wallet={wallet} is_mobile={is_mobile} />}
                        />
                    );
                })}
            </ThemedScrollbars>
        </div>
    );
});

export default WalletLinkingStep;
