import React from 'react';
// import { Icon } from '@deriv/components';
import classNames from 'classnames';
// import { TAccountCategory, TAccountStatus, TWalletMaltaCurrency, TWalletSvgCurrency } from 'Types';
import WalletHeader from 'Components/wallet-header';
import { TAccountCategory, TAccountStatus, TWalletSvgCurrency } from 'Types';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import CFDsListing from 'Components/cfds-listing';
import { DesktopWrapper, MobileWrapper, ButtonToggle } from '@deriv/components';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import './wallet.scss';

// type TWalletHeaderCommon = {
//     balance?: string;
//     is_open_wallet?: boolean;
// };

// type TWalletHeaderDemo = TWalletHeaderCommon & {
//     account_type: Extract<TAccountCategory, 'demo'>;
//     account_status?: never;
//     jurisdiction?: never;
//     currency?: never;
// };

// type TWalletHeaderSvg = TWalletHeaderCommon & {
//     account_status?: TAccountStatus;
//     account_type?: Extract<TAccountCategory, 'real'>;
//     jurisdiction: 'svg';
//     currency: TWalletSvgCurrency;
// };

// type TWalletHeaderMalta = TWalletHeaderCommon & {
//     account_status?: TAccountStatus;
//     account_type?: Extract<TAccountCategory, 'real'>;
//     jurisdiction: 'malta';
//     currency: TWalletMaltaCurrency;
// };

export type TWalletTestAccount = {
    account_status: TAccountStatus;
    balance: string;
    currency: TWalletSvgCurrency;
    jurisdiction: 'svg' | 'malta';
    account_type: TAccountCategory;
};

type TWallet = { account: TWalletTestAccount };

const Wallet = React.memo(({ account }: TWallet) => {
    // const [is_open, setIsOpen] = React.useState(is_open_wallet);

    const Divider = () => <div className='wallet__divider' />;

    return (
        <div className={classNames('wallet')}>
            <WalletHeader
                account_type={account.account_type}
                balance={account.balance}
                currency={account.currency}
                jurisdiction={account.jurisdiction}
                account_status={account.account_status}
            />
            <Divider />
            <CFDsListing />
            <Divider />
            <OptionsAndMultipliersListing />

            <DesktopWrapper>
                <div className='traders-hub__main-container'>
                    <OptionsAndMultipliersListing />
                    <CFDsListing />
                </div>
            </DesktopWrapper>
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
