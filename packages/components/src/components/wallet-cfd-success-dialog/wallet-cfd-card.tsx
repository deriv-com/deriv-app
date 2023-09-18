import React from 'react';
import classNames from 'classnames';
import Text from '../text';
import { isMobile } from '@deriv/shared';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';
import { TWalletCFDCard } from './wallet-cfd-success-dialog';
import './wallet-cfd-card.scss';

const WalletCFDCard = ({ wallet }: { wallet: TWalletCFDCard }) => {
    const {
        account_title,
        app_icon,
        balance,
        currency,
        currency_title,
        gradient_header_class,
        icon,
        is_demo,
        wallet_label,
    } = wallet;

    return (
        <div className='wallet-cfd-card'>
            <div className='wallet-cfd-card__bg'>
                <div className='wallet-cfd-card__shine' />
                <div className='wallet-cfd-card__icon'>
                    <AppLinkedWithWalletIcon
                        app_icon={app_icon}
                        gradient_class={gradient_header_class}
                        hide_watermark
                        type={is_demo ? 'demo' : 'fiat'}
                        wallet_icon={icon}
                    />
                </div>
                <div
                    className={classNames('wallet-cfd-card__badge', {
                        'wallet-cfd-card__badge--demo': is_demo,
                        'wallet-cfd-card__badge--real': !is_demo,
                    })}
                >
                    <Text
                        color='colored-background'
                        line_height='xxs'
                        weight='bold'
                        size={isMobile() ? 'xxxxs' : 'xxxs'}
                    >
                        {wallet_label}
                    </Text>
                </div>
                <div className='wallet-cfd-card__details'>
                    {/* account title */}
                    <Text color='prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                        {account_title}
                    </Text>
                    {/* wallet currency */}
                    <Text color='less-prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                        {currency_title}
                    </Text>
                    {/* total balance */}
                    <Text color='prominent' weight='bold' size={isMobile() ? 'xxxs' : 'xxs'}>
                        {balance} {currency}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default WalletCFDCard;
