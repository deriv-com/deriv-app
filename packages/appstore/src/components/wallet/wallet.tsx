import React from 'react';
// import { Icon } from '@deriv/components';
import classNames from 'classnames';
// import { TAccountCategory, TAccountStatus, TWalletMaltaCurrency, TWalletSvgCurrency } from 'Types';
import './wallet.scss';
import WalletHeader from 'Components/wallet-header';
import { TAccountCategory, TAccountStatus, TWalletSvgCurrency } from 'Types';

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
            <span>tra la la</span>
            <Divider />
            <Divider />
            <div className='wallet__divider' />
            <Divider />
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
