import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';
import { TAccountCategory, TAccountStatus, TJurisdictionData, TWalletCurrency } from 'Types';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-header.scss';

type TWalletHeader = {
    account_type?: TAccountCategory;
    shortcode?: Extract<TJurisdictionData['jurisdiction'], 'svg' | 'malta'>;
    currency?: TWalletCurrency;
    balance?: string;
    account_status?: TAccountStatus;
    is_open_wallet?: boolean;
};

const WalletHeader = React.memo(
    ({
        account_status = '',
        balance = '0.00',
        currency = 'USD',
        shortcode = 'svg',
        account_type = 'real',
        is_open_wallet = false,
    }: TWalletHeader) => {
        const [is_open, setIsOpen] = React.useState(is_open_wallet);
        const is_demo = account_type === 'demo';

        const wallet_btns = getWalletHeaderButtons(is_demo);

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
                        <WalletHeaderTitle is_demo={is_demo} currency={currency} shortcode={shortcode} />
                        <WalletHeaderButtons is_disabled={!!account_status} is_open={is_open} btns={wallet_btns} />
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
