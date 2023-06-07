import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';
import { TAccountCategory, TAccountStatus, TWalletShortcode, TWalletCurrency } from 'Types';
import { getWalletHeaderButtons } from 'Constants/utils';
import { formatMoney } from '@deriv/shared';
import './wallet-header.scss';

type TWalletHeader = {
    account_type: TAccountCategory;
    shortcode?: TWalletShortcode;
    currency?: TWalletCurrency;
    balance?: number;
    account_status?: TAccountStatus;
    is_open_wallet: boolean;
    setIsOpen: (is_open: boolean) => void;
    icon?: string;
    icon_type?: string;
};

const WalletHeader = React.memo(
    ({
        account_status = '',
        balance = 0,
        currency = 'USD',
        shortcode = 'svg',
        account_type = 'real',
        is_open_wallet,
        setIsOpen,
        icon,
        icon_type,
    }: TWalletHeader) => {
        const is_demo = account_type === 'demo';

        const wallet_buttons = getWalletHeaderButtons(is_demo);

        const onArrowClickHandler = () => {
            setIsOpen(!is_open_wallet);
        };

        return (
            <div
                className={classNames('wallet-header', {
                    'wallet-header__demo': is_demo,
                })}
            >
                <div className='wallet-header__container'>
                    <WalletCurrencyCard
                        account_type={account_type}
                        currency={currency}
                        icon={icon}
                        icon_type={icon_type}
                    />
                    <div className='wallet-header__description'>
                        <WalletHeaderTitle is_demo={is_demo} currency={currency} shortcode={shortcode} />
                        <WalletHeaderButtons
                            is_disabled={!!account_status}
                            is_open={is_open_wallet}
                            buttons={wallet_buttons}
                        />
                    </div>
                    <div className='wallet-header__balance'>
                        <WalletHeaderBalance
                            account_status={account_status}
                            balance={formatMoney(currency, balance, true)}
                            currency={currency}
                        />
                        <Icon
                            data_testid='dt_arrow'
                            onClick={onArrowClickHandler}
                            icon='IcChevronDownBold'
                            className={classNames('wallet-header__balance-arrow-icon', {
                                'wallet-header__balance-arrow-icon-active': is_open_wallet,
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
