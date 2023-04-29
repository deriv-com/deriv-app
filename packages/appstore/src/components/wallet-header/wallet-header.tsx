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
    is_open_wallet?: boolean;
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

const WalletHeader = React.memo(
    ({
        account_status = '',
        balance = '0.00',
        currency = 'USD',
        jurisdiction = 'svg',
        account_type = 'real',
        is_open_wallet = false,
    }: TWalletHeader) => {
        const [is_open, setIsOpen] = React.useState(is_open_wallet);
        const is_demo = account_type === 'demo';

        const onArrowClickHandler = () => {
            setIsOpen(!is_open);
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
                            is_open={is_open}
                            account_type={account_type}
                        />
                    </div>
                    <div className='wallet-header__balance'>
                        <WalletHeaderBalance account_status={account_status} balance={balance} currency={currency} />
                        <Icon
                            data_testid='dt_arrow'
                            onClick={onArrowClickHandler}
                            icon='IcChevronDownBold'
                            className={classNames('wallet-header__balance-arrow-icon', {
                                'wallet-header__balance-arrow-icon-active': is_open,
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
