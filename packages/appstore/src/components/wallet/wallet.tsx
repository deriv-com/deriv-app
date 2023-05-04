import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import { TAccountCategory, TAccountStatus, TJurisdictionData, TWalletSvgCurrency } from 'Types';
import WalletContent from 'Components/wallet-content';
import './wallet.scss';

export type TWalletTestAccount = {
    account_status: TAccountStatus;
    balance: string;
    currency: TWalletSvgCurrency;
    shortcode: Extract<TJurisdictionData['jurisdiction'], 'svg' | 'malta'>;
    account_type: TAccountCategory;
};

type TWallet = {
    account: TWalletTestAccount;
    is_open_wallet?: boolean;
};

const Wallet = React.memo(({ account, is_open_wallet = false }: TWallet) => {
    // const [is_open, setIsOpen] = React.useState(is_open_wallet);

    const [is_open, setIsOpen] = React.useState(is_open_wallet);
    const is_demo = account.account_type === 'demo';

    // const Divider = () => <div className='wallet__divider' />;
    // --wallet-demo-divider-color

    return (
        <div
            className={classNames('wallet', {
                wallet__demo: is_demo,
            })}
        >
            <WalletHeader
                account_type={account.account_type}
                balance={account.balance}
                currency={account.currency}
                shortcode={account.shortcode}
                account_status={account.account_status}
                is_open_wallet={is_open}
                setIsOpen={setIsOpen}
            />
            {is_open && <WalletContent is_demo={is_demo} />}
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
