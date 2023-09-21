import React from 'react';
import classNames from 'classnames';
import { AppLinkedWithWalletIcon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import './wallet-app-card.scss';

type TWalletAppCard = {
    account_title: React.ReactNode;
    balance: string;
    currency_title: string;
    currency?: string;
    gradient_card_class?: string;
    icon?: string;
    is_demo?: boolean;
};

const WalletAppCard = observer(({ wallet }: { wallet: TWalletAppCard }) => {
    const { balance, currency, account_title, gradient_card_class, icon, is_demo, currency_title } = wallet;

    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='wallet-app-card'>
            <div className='wallet-app-card__bg'>
                <div className='wallet-app-card__shine' />
                <div className='wallet-app-card__icon'>
                    <AppLinkedWithWalletIcon
                        size={is_mobile ? 'small' : 'medium'}
                        app_icon='IcAppstoreOptions'
                        gradient_class={gradient_card_class}
                        hide_watermark
                        type={is_demo ? 'demo' : 'fiat'}
                        wallet_icon={icon}
                    />
                </div>
                <div
                    className={classNames('wallet-app-card__badge', {
                        'wallet-app-card__badge--demo': is_demo,
                        'wallet-app-card__badge--real': !is_demo,
                    })}
                >
                    <Text
                        color='colored-background'
                        line_height='xxs'
                        weight='bold'
                        size={is_mobile ? 'xxxxs' : 'xxxs'}
                    >
                        {is_demo ? <Localize i18n_default_text='Demo' /> : <Localize i18n_default_text='Real' />}
                    </Text>
                </div>
                <div className='wallet-app-card__details'>
                    {/* account title */}
                    <Text color='prominent' weight='light' size={is_mobile ? 'xxxxs' : 'xxxs'}>
                        {account_title}
                    </Text>
                    {/* wallet currency */}
                    <Text color='less-prominent' weight='light' size={is_mobile ? 'xxxxs' : 'xxxs'}>
                        {currency_title}
                    </Text>
                    {/* total balance */}
                    <Text color='prominent' weight='bold' size={is_mobile ? 'xxxs' : 'xxs'}>
                        {balance} {currency}
                    </Text>
                </div>
            </div>
        </div>
    );
});

export default WalletAppCard;
