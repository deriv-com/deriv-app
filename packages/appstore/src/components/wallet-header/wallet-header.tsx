import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';
import './wallet-header.scss';
import { TAccountCategory, TAccountStatus, TWalletMaltaCurrency, TWalletSvgCurrency } from 'Types';

type TWalletHeaderCommon = {
    balance?: string;
};

type TWalletHeaderDemo = TWalletHeaderCommon & {
    account_type: Extract<TAccountCategory, 'demo'>;
    account_status?: never;
    jurisdiction?: never;
    currency?: never;
};

type TWalletHeaderSvg = TWalletHeaderCommon & {
    account_status?: TAccountStatus;
    account_type?: Extract<TAccountCategory, 'real'>;
    jurisdiction: 'svg';
    currency: TWalletSvgCurrency;
};

type TWalletHeaderMalta = TWalletHeaderCommon & {
    account_status?: TAccountStatus;
    account_type?: Extract<TAccountCategory, 'real'>;
    jurisdiction: 'malta';
    currency: TWalletMaltaCurrency;
};

type TWalletHeader = TWalletHeaderDemo | TWalletHeaderSvg | TWalletHeaderMalta;

// TODO: icons for usdc, ltc and tether get from cashier

const WalletHeader = React.memo(
    ({
        account_status = '',
        balance = '0.00',
        currency = 'USD',
        jurisdiction = 'svg',
        account_type = 'real',
    }: TWalletHeader) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const is_demo = account_type === 'demo';

        const onArrowClickHandler = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div
                className={classNames('wallet-header', {
                    'wallet-header__demo': is_demo,
                })}
            >
                <div className='wallet-header__container'>
                    <WalletCurrencyCard account_type={account_type} currency={currency} />
                    <div className='wallet-header__description'>
                        <WalletHeaderTitle is_demo={is_demo} currency={currency} jurisdiction={jurisdiction} />
                        <WalletHeaderButtons
                            is_disabled={!!account_status}
                            is_open={isOpen}
                            account_type={account_type}
                        />
                    </div>
                    <div className='wallet-header__balance'>
                        <WalletHeaderBalance account_status={account_status} balance={balance} currency={currency} />
                        <Icon
                            onClick={onArrowClickHandler}
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
