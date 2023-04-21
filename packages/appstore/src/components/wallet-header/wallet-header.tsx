import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TWalletsImagesListKeys } from 'Assets/svgs/image-types';
import WalletsImage from 'Assets/svgs/wallets';
import classNames from 'classnames';
// import TradingPlatformIcon from 'Assets/svgs/trading-platform';
// import WalletsImage from 'Assets/svgs/wallets';
import React from 'react';

type TWalletHeaderCommon = {
    balance?: string;
};

type TWalletHeaderDemo = TWalletHeaderCommon & {
    jurisdiction: 'virtual';
    currency?: never;
};

type TWalletHeaderSvg = TWalletHeaderCommon & {
    jurisdiction: 'svg';
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

type TWalletHeaderMalta = TWalletHeaderCommon & {
    jurisdiction: 'malta';
    currency: 'USD' | 'EUR';
};

type TWalletHeader = TWalletHeaderDemo | TWalletHeaderSvg | TWalletHeaderMalta;

const WalletHeader = React.memo(({ balance = '0.00', currency = 'USD', jurisdiction = 'svg' }: TWalletHeader) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // const currency_lowercase: Lowercase<TWalletHeaderNotDemo['currency']> = currency.toLowerCase();
    const currency_lowercase = currency.toLowerCase() as Lowercase<TWalletHeaderSvg['currency']>;
    const image_currency: TWalletsImagesListKeys = `${currency_lowercase}_currency`;
    const image_bg: TWalletsImagesListKeys = 'aud_bg';

    const title_size = 'sm';
    const badge_size = 'xxxs';
    const badge_lh_size = 'xxxs';
    const balance_title_size = 'xxs';
    const balance_amount_size = 'm';
    const button_text_size = 'xs';

    const title_text = `<0>${currency} Wallet</0>`;
    const badge_text = `<0>${jurisdiction.toUpperCase()}</0>`;
    const balance_title_text = '<0>Wallet balance</0>';
    const balance_amount_text = `<0>${balance} ${currency}</0>`;

    const wallet_buttons = (
        <div className='wallet-header__description-buttons'>
            <div className='wallet-header__description-buttons-item'>
                <Icon icon='IcAppstoreWalletDeposit' />
                <Localize
                    i18n_default_text={'<0>Deposit</0>'}
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
            <div className='wallet-header__description-buttons-item'>
                <Icon icon='IcAppstoreWalletWithdraw' />
                <Localize
                    i18n_default_text={'<0>Withdraw</0>'}
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
            <div className='wallet-header__description-buttons-item'>
                <Icon icon='IcAppstoreWalletTransfer' />
                <Localize
                    i18n_default_text={'<0>Transfer</0>'}
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
            <div className='wallet-header__description-buttons-item'>
                <Icon icon='IcAppstoreWalletTransactions' />
                <Localize
                    i18n_default_text={'<0>Transactions</0>'}
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
        </div>
    );

    return (
        <div className='wallet-header'>
            <div className='wallet-header__container'>
                <div className='wallet-header__currency'>
                    <Icon icon='IcAppstoreWalletAudBg' width={128} height={80} />
                    {/* <WalletsImage image={image_bg} /> */}
                    <Icon icon='IcAppstoreWalletAudCurrency' size={48} />
                </div>
                <div className='wallet-header__description'>
                    <div className='wallet-header__description-title'>
                        <Localize
                            i18n_default_text={title_text}
                            components={[<Text key={0} weight='bold' size={title_size} />]}
                        />
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
});

WalletHeader.displayName = 'WalletHeader';
export default WalletHeader;
