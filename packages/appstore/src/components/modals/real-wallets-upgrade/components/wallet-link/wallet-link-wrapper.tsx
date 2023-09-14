import React from 'react';
import classNames from 'classnames';
import { Icon, Text, WalletCard } from '@deriv/components';
import { localize } from '@deriv/translations';
import WalletAccount from '../wallet-account/wallet-account';
import { observer, useStore } from '@deriv/stores';
import './wallet-link-wrapper.scss';
import { ContentWithLink } from '../content-with-link';

export type TWalletLinkWrapper = {
    wallet_details: React.ComponentProps<typeof WalletCard>['wallet'];
    account_list: {
        balance: number;
        currency: string;
        account_name: string;
        icon: string;
    }[];
    center: any;
};

const WalletLinkWrapper = observer(({ wallet_details, account_list, center }: TWalletLinkWrapper) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    return (
        <div className='wallet-link-wrapper'>
            <ContentWithLink is_right_forked fork_margin={24}>
                {account_list.map(account => {
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
            </ContentWithLink>
            <div className='wallet-link-wrapper__center'>
                <div className='wallet-link-wrapper__link-icon'>
                    <Icon icon='IcAppstoreWalletsLink' size={40} />
                </div>
                {center}
            </div>
            <ContentWithLink hide_fork fork_margin={24}>
                <WalletCard wallet={wallet_details} size='large' state='default' />
            </ContentWithLink>
            {/* <div className='wallet-link-wrapper-left'>
                <div className='wallet-link-wrapper__accounts'>
                    {is_mobile && (
                        <Text
                            as='div'
                            className='wallet-link-wrapper__title-text wallet-link-wrapper__accounts-title'
                            color='prominent'
                            size='xxxs'
                        >
                            {localize('Your current trading account(s)')}
                        </Text>
                    )}
                    {account_list.map(account => {
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
                </div>
            </div>
            <div className='wallet-link-wrapper__link'>
                <div
                    className={classNames('wallet-link-wrapper__link-bracket', {
                        'wallet-link-wrapper__link-bracket--single': account_list.length === 1,
                    })}
                />
                <div className='wallet-link-wrapper__link-icon'>
                    <Icon icon='IcAppstoreWalletsLink' size={40} />
                </div>
            </div>
            <div className='wallet-link-wrapper__card-wrapper'>
                <WalletCard wallet={wallet_details} size='large' state='default' />
                {is_mobile && (
                    <Text
                        className='wallet-link-wrapper__title-text wallet-link-wrapper__card-wrapper-title'
                        color='prominent'
                        size='xxxs'
                    >
                        {localize('Your new Wallet')}
                    </Text>
                )}
            </div> */}
        </div>
    );
});

export default WalletLinkWrapper;
