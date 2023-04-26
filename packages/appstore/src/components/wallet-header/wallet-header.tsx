import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import React from 'react';

type TWalletHeaderCommon = {
    balance?: string;
};

type TWalletHeaderDemo = TWalletHeaderCommon & {
    account_type: 'demo';
    jurisdiction?: never;
    currency?: never;
};

type TWalletHeaderSvg = TWalletHeaderCommon & {
    account_type?: 'real';
    jurisdiction: 'svg';
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

type TWalletHeaderMalta = TWalletHeaderCommon & {
    account_type?: 'real';
    jurisdiction: 'malta';
    currency: 'USD' | 'EUR';
};

type TWalletHeader = TWalletHeaderDemo | TWalletHeaderSvg | TWalletHeaderMalta;

const WalletHeader = observer(
    ({ balance = '0.00', currency = 'USD', jurisdiction = 'svg', account_type = 'real' }: TWalletHeader) => {
        const {
            ui: { is_dark_mode_on },
        } = useStore();

        const [isOpen, setIsOpen] = React.useState(false);
        const is_demo = account_type === 'demo';
        const theme = is_dark_mode_on ? '--dark' : '';
        const demo_icon_path = is_dark_mode_on ? 'IcWalletDerivDemoDark' : 'IcWalletDerivDemoLight';

        const currency_icon_path = React.useMemo(
            () => ({
                USD: is_demo ? demo_icon_path : 'IcCurrencyUsd',
                EUR: 'IcCurrencyEur',
                AUD: 'IcCurrencyAud',
                BTC: is_dark_mode_on ? 'IcCashierBitcoinDark' : 'IcCashierBitcoinLight',
                ETH: is_dark_mode_on ? 'IcWalletEtheriumDark' : 'IcWalletEtheriumLight',
                USDT: is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight',
                eUSDT: is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight',
                tUSDT: is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight',
                LTC: is_dark_mode_on ? 'IcWalletLitecoinDark' : 'IcWalletLitecoinLight',
                USDC: is_dark_mode_on ? 'IcWalletUsdcDark' : 'IcWalletUsdcLight',
            }),
            [demo_icon_path, is_dark_mode_on, is_demo]
        );

        const is_fiat = currency === 'USD' || currency === 'EUR' || currency === 'AUD';
        const currency_icon_name = currency_icon_path[currency] || 'Unknown';
        const currency_icon_size = is_fiat && !is_demo ? 48 : 100;

        const title_size = 'sm';
        const badge_size = 'xxxs';
        const badge_lh_size = 'xxxs';
        const balance_title_size = 'xxs';
        const balance_amount_size = 'm';
        const button_text_size = 'xs';

        const title_text = `<0>${is_demo ? `Demo ${currency}` : currency} Wallet</0>`;
        const badge_text = `<0>${jurisdiction.toUpperCase()}</0>`;
        const balance_title_text = '<0>Wallet balance</0>';
        const balance_amount_text = `<0>${balance} ${currency}</0>`;

        const btn_names = is_demo
            ? ['Transfer', 'Transactions', 'Deposit']
            : ['Deposit', 'Withdraw', 'Transfer', 'Transactions'];
        const icon_names = is_demo
            ? ['IcAccountTransfer', 'IcStatement', 'IcCashierAdd']
            : ['IcCashierAdd', 'IcCashierMinus', 'IcAccountTransfer', 'IcStatement'];

        const wallet_buttons = (
            <div className='wallet-header__description-buttons'>
                {btn_names.map((name, index) => (
                    <div key={name} className='wallet-header__description-buttons-item' aria-disabled={true}>
                        <Icon icon={icon_names[index]} custom_color={'var(--text-general)'} />
                        <Localize
                            i18n_default_text={`<0>${is_demo && name === 'Deposit' ? 'Reset balance' : name}</0>`}
                            components={[
                                <Text
                                    key={0}
                                    weight='bold'
                                    size={button_text_size}
                                    className={classNames('wallet-header__description-buttons-item-text', {
                                        'wallet-header__description-buttons-item-active': isOpen,
                                    })}
                                />,
                            ]}
                        />
                    </div>
                ))}
            </div>
        );

        return (
            <div
                className={classNames('wallet-header', {
                    'wallet-header__demo': is_demo,
                })}
            >
                <div className='wallet-header__container'>
                    <div
                        className={`wallet-header__currency wallet__${
                            is_demo ? 'demo' : currency.toLowerCase()
                        }-bg${theme}`}
                    >
                        <Icon data-testid={`dt_${currency}`} icon={currency_icon_name} size={currency_icon_size} />
                        {/* <Icon icon={'IcWalletDerivDemoDark'} size={50} /> */}
                    </div>
                    <div className='wallet-header__description'>
                        <div className='wallet-header__description-title'>
                            <Localize
                                i18n_default_text={title_text}
                                components={[<Text key={0} weight='bold' size={title_size} />]}
                            />
                            {!is_demo && (
                                <Localize
                                    i18n_default_text={badge_text}
                                    components={[
                                        <Text
                                            key={0}
                                            weight='bold'
                                            size={badge_size}
                                            line_height={badge_lh_size}
                                            className='wallet-header__description-badge'
                                        />,
                                    ]}
                                />
                            )}
                        </div>
                        {wallet_buttons}
                    </div>
                    <div className='wallet-header__balance'>
                        <div className='wallet-header__balance-title-amount'>
                            <Localize
                                i18n_default_text={balance_title_text}
                                components={[<Text key={0} color='less-prominent' size={balance_title_size} />]}
                            />
                            <Localize
                                i18n_default_text={balance_amount_text}
                                components={[<Text key={0} weight='bold' size={balance_amount_size} />]}
                            />
                        </div>
                        <Icon
                            onClick={() => setIsOpen(!isOpen)}
                            icon='IcChevronDownBold'
                            className={classNames('wallet-header__balance-arrow-icon', {
                                'wallet-header__balance-arrow-icon-active': isOpen,
                            })}
                        />
                    </div>
                </div>
            </div>
        );
    }
);
WalletHeader.displayName = 'WalletHeader';
export default WalletHeader;
