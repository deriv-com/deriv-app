import React from 'react';
import { isMobile } from '@deriv/shared';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';
import Text from '../text';
import Badge from '../badge';
import './wallet-app-card.scss';

type WalletAppCardProps = {
    wallet: {
        account_title: React.ReactNode;
        app_icon?: string;
        balance?: string;
        currency_title: string;
        gradient_card_class: string;
        icon?: string;
        is_demo?: boolean;
        label: string;
    };
};

const WalletAppCard = ({ wallet }: WalletAppCardProps) => {
    const {
        account_title,
        app_icon = 'IcWalletOptionsLight',
        balance,
        currency_title,
        gradient_card_class,
        icon,
        is_demo,
        label,
    } = wallet;

    return (
        <div className='wallet-app-card'>
            <div className='wallet-app-card__bg'>
                <div className='wallet-app-card__shine' />
                <div className='wallet-app-card__icon'>
                    <AppLinkedWithWalletIcon
                        app_icon={app_icon}
                        gradient_class={gradient_card_class}
                        hide_watermark
                        type={is_demo ? 'demo' : 'fiat'}
                        wallet_icon={icon ?? ''}
                    />
                </div>
                <Badge
                    className='wallet-app-card__badge'
                    label={label}
                    type='contained'
                    background_color={is_demo ? 'blue' : 'red'}
                    rounded_corners={2}
                    size='large'
                />
                <div className='wallet-app-card__details'>
                    <Text color='prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                        {account_title}
                    </Text>
                    <Text color='less-prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                        {currency_title}
                    </Text>
                    <Text color='prominent' weight='bold' size={isMobile() ? 'xxxs' : 'xxs'}>
                        {balance}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default WalletAppCard;
