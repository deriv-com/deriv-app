import React from 'react';
import { Icon, Text } from '@deriv/components';
import WalletAccount from '../wallet-account/wallet-account';
import './wallet-link-wrapper.scss';

const WalletLinkWrapper = ({ account_list }) => {
    return (
        <div className='wallet-link-wrapper'>
            <div className='wallet-link-wrapper__accounts'>
                <Text className='wallet-link-wrapper__title-text wallet-link-wrapper__accounts-title'>
                    Your current trading account(s)
                </Text>
                {account_list.map((account, index) => {
                    return (
                        <WalletAccount
                            key={index}
                            balance={account.balance}
                            currency={account.currency}
                            icon={account.icon}
                            name={account.account_name}
                        />
                    );
                })}
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
