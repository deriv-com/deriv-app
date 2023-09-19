import React from 'react';
import { Text, ThemedScrollbars, WalletCard } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import WalletLinkWrapper, { TWalletLinkWrapper } from '../wallet-link/wallet-link-wrapper';
import './wallet-linking-step.scss';
import WalletAccount from '../wallet-account/wallet-account';
import classNames from 'classnames';

type TWalletLinkingStep = {
    data: { title: string; wallets: TWalletLinkWrapper[] };
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
                align='center'
                size='xxs'
            >
                <Localize i18n_default_text='Your existing funds will remain in your trading account(s) and can be transferred to your Wallet after the upgrade.' />
            </Text>
            {!is_mobile && (
                <div className='wallet-linking-step__title'>
                    <Text className='wallet-linking-step__title-text' color='prominent' size='xxxs'>
                        {localize('Your current trading account(s)')}
                    </Text>
                    <Text className='wallet-linking-step__title-text' color='prominent' size='xxxs'>
                        {localize('Your new Wallet(s)')}
                    </Text>
                </div>
            )}
            <ThemedScrollbars className='wallet-linking-step__content'>
                {data.wallets.map(wallet => {
                    return (
                        <WalletLinkWrapper
                            key={wallet.wallet_details.name}
                            show_left_fork={wallet.account_list.length > 1 || is_mobile}
                            left={() => {
                                return (
                                    <>
                                        {is_mobile && (
                                            <Text
                                                as='div'
                                                className='wallet-linking-step__title-text wallet-linking-step__accounts-text '
                                                color='prominent'
                                                size='xxxs'
                                            >
                                                {localize('Your current trading account(s)')}
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
                                                />
                                            );
                                        })}
                                    </>
                                );
                            }}
                            right={() => {
                                return (
                                    <div style={{ height: '13.6rem', position: 'relative' }}>
                                        <WalletCard wallet={wallet.wallet_details} size='large' state='default' />
                                        {is_mobile && (
                                            <Text
                                                className='wallet-linking-step__title-text wallet-linking-step__wallet-card-text'
                                                color='prominent'
                                                size='xxxs'
                                            >
                                                {localize('Your new Wallet')}
                                            </Text>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    );
                })}
            </ThemedScrollbars>
        </div>
    );
});

export default WalletLinkingStep;
