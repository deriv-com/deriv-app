import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import { TAccountCategory, TAccountStatus, TWalletCurrency, TWalletShortcode } from 'Types';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import './wallet.scss';

export type TWalletTestAccount = {
    account_status: TAccountStatus;
    balance: string;
    currency: TWalletCurrency;
    shortcode: TWalletShortcode;
    account_type: TAccountCategory;
};

type TWallet = {
    account: TWalletTestAccount;
    is_open_wallet?: boolean;
};

const Wallet = React.memo(({ account, is_open_wallet = false }: TWallet) => {
    const [is_open, setIsOpen] = React.useState(is_open_wallet);
    const is_demo = account.account_type === 'demo';

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
            <CSSTransition appear in={is_open} timeout={250} classNames='wallet__transition' unmountOnExit>
                <WalletContent is_demo={is_demo} is_eu={account.shortcode === 'malta'} />
            </CSSTransition>
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
