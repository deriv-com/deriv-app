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
        const [isOpen, setIsOpen] = React.useState(false);
        const is_demo = account_type === 'demo';

        const {
            ui: { is_dark_mode_on },
        } = useStore();

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
                    <div key={name} className='wallet-header__description-buttons-item'>
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
            <div className='wallet-header'>
                <div className='wallet-header__container'>
                    <div
                        className={`wallet-header__currency wallet-header__currency-${currency}${
                            is_dark_mode_on ? '-dark' : ''
                        }`}
                    >
                        <Icon icon={`IcCurrency${currency[0] + currency.slice(1).toLowerCase()}`} size={48} />
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
