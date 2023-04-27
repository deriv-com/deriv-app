import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCurrencyCard from './wallet-currency-card';
import WalletHeaderButtons from './wallet-header-buttons';
import WalletHeaderTitle from './wallet-header-title';
import WalletHeaderBalance from './wallet-header-balance';

export type TAccountStatus = 'pending' | 'failed' | 'need_verification' | '';

type TWalletHeaderCommon = {
    // TODO: just for testing till BE is not ready
    account_status?: TAccountStatus;
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
