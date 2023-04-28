import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import { Text } from '@deriv/ui';
// import WalletIcon from 'Assets/svgs/wallet';
import './1wallet-card.scss';

type TWalletCardData = {
    [key: string]: {
        colors: {
            primary: string;
            secondary: string;
        };
        default_currency: string;
        display_name: string;
    };
};

type WalletCardProps = {
    active?: boolean;
    balance?: string;
    currency?: string;
    dark?: boolean;
    demo?: boolean;
    disabled?: boolean;
    faded?: boolean;
    size?: 'small' | 'medium' | 'large';
    wallet_name: string;
};

type CardText = {
    balance: WalletCardProps['balance'];
    currency: WalletCardProps['currency'];
    demo: WalletCardProps['demo'];
    wallet_name: WalletCardProps['wallet_name'];
};

// TODO: update wallet mapping once BE API is ready and move colors to css variables
const wallet_card_data: TWalletCardData = {
    aud: {
        colors: { primary: '#0DB43D', secondary: '#FFCD00' },
        default_currency: 'AUD',
        display_name: 'AUD',
    },
    bitcoin: {
        colors: { primary: '#F7931B', secondary: '#F7C71B' },
        default_currency: 'BTC',
        display_name: 'Bitcoin',
    },
    demo: {
        colors: { primary: '#FF6444', secondary: '#FF444F' },
        default_currency: 'USD',
        display_name: 'Demo',
    },
    deriv_p2p: {
        colors: { primary: '#FF444F', secondary: '#FF6444' },
        default_currency: 'USD',
        display_name: 'Deriv P2P',
    },
    ethereum: {
        colors: { primary: '#52567F', secondary: '#828CAD' },
        default_currency: 'ETH',
        display_name: 'Ethereum',
    },
    eur: {
        colors: { primary: '#283991', secondary: '#F8D12E' },
        default_currency: 'EUR',
        display_name: 'EUR',
    },
    gbp: {
        colors: { primary: '#283991', secondary: '#F44336' },
        default_currency: 'GBP',
        display_name: 'GBP',
    },
    litecoin: {
        colors: { primary: '#A5A8A9', secondary: '#C1CCCF' },
        default_currency: 'LTC',
        display_name: 'Litecoin',
    },
    payment_agent: {
        colors: { primary: '#979797', secondary: '#B2C2C4' },
        default_currency: 'USD',
        display_name: 'Payment Agent',
    },
    tether: {
        colors: { primary: '#009393', secondary: '#04D9D9' },
        default_currency: 'USDT',
        display_name: 'Tether',
    },
    usd: {
        colors: { primary: '#F44336', secondary: '#283991' },
        default_currency: 'USD',
        display_name: 'USD',
    },
    usd_coin: {
        colors: { primary: '#2775CA', secondary: '#224CE1' },
        default_currency: 'USDC',
        display_name: 'USD Coin',
    },
};

const fiat_wallets = ['aud', 'eur', 'gbp', 'usd'];

const snakeToPascal = (string: string) => {
    return string
        .split('_')
        .map(substr => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join('');
};

const CardText = ({ balance, currency, demo, wallet_name }: CardText) => {
    const wallet_title = wallet_card_data[wallet_name]?.display_name || wallet_name;
    const wallet_currency = currency || wallet_card_data[wallet_name]?.default_currency;

    if (balance) {
        return (
            <div>
                <Text as='div' type='extra-small' bold={false}>
                    {demo ? 'Demo' : wallet_title} {fiat_wallets.every(f => wallet_name !== f) && wallet_currency}{' '}
                    wallet
                </Text>
                <Text as='div' type='paragraph-2' bold>
                    {balance} {wallet_currency}
                </Text>
            </div>
        );
    }
    return (
        <Text as='div' type='paragraph-2' bold={false}>
            {demo ? 'Demo' : wallet_title} wallet
        </Text>
    );
};

const WalletCard1 = ({
    active,
    balance,
    currency,
    dark,
    demo,
    disabled,
    faded,
    size,
    wallet_name,
}: WalletCardProps) => {
    const style = {
        '--primary-color': wallet_card_data[wallet_name]?.colors.primary || '#CFCFCF',
        '--secondary-color': wallet_card_data[wallet_name]?.colors.secondary || '#D6DADB',
        '--base-color': dark ? '#151717' : '#fff',
        '--stroke-theme-color-1': dark ? '#fff' : '#0E0E0E',
    };
    const getBackgroundIcon = () => {
        if (size === 'small') return 'IcAppstoreWalletSmall';
        return demo || wallet_name === 'demo' ? 'IcAppstoreWalletDemo' : 'IcAppstoreWalletDefault';
    };

    const name = snakeToPascal(wallet_name || '');

    const wallet_logo = `${name}${dark ? 'Dark' : 'Light'}`;

    return (
        <div
            data-testid='wallet-card'
            className={classNames('wallet-card', {
                [`wallet-card--${size}`]: size,
                'wallet-card--dark': dark,
                'wallet-card--disabled': disabled,
                'wallet-card--active': active && !disabled,
                'wallet-card--faded': faded,
            })}
        >
            <div className='wallet-card__background'>
                <Icon icon={getBackgroundIcon()} style={style} size='100%' />
            </div>
            {active && !disabled && (
                <Icon
                    data_testid='ic-checkmark-circle'
                    icon='IcCheckmarkCircle'
                    style={{ '--fill-color1': 'var(--brand-red-coral)', '--fill-color3': 'white' }}
                    className='wallet-card__active-icon'
                />
            )}
            <div className='wallet-card__card-content'>
                {wallet_card_data[wallet_name] ? (
                    <div
                        className={classNames('wallet-card__logo', {
                            [`wallet-card__logo--${wallet_name}`]: wallet_name,
                        })}
                        aria-label='payment_method_logo'
                    >
                        {/* <WalletIcon icon={wallet_logo} /> */}
                    </div>
                ) : (
                    <div className={classNames('wallet-card__logo', 'wallet-card__logo--placeholder')} />
                )}
                {size !== 'small' && (
                    <CardText balance={balance} currency={currency} demo={demo} wallet_name={wallet_name} />
                )}
            </div>
        </div>
    );
};

export default WalletCard1;
