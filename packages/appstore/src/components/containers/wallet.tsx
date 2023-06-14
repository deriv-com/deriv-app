import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { TWalletAccount, TWalletCurrency, TWalletShortcode } from 'Types';
import './wallet.scss';

type TWallet = {
    wallet_account: TWalletAccount;
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const Wallet = React.memo(({ wallet_account, active, setActive }: TWallet) => {
    const is_demo = wallet_account.is_virtual;
    const shortcode =
        wallet_account.landing_company_shortcode === 'maltainvest' ? 'malta' : wallet_account.landing_company_shortcode;

    return (
        <div
            className={classNames('wallet', {
                wallet__demo: is_demo,
            })}
        >
            <WalletHeader
                account_type={is_demo ? 'demo' : 'real'}
                balance={wallet_account.balance}
                currency={wallet_account.currency as TWalletCurrency}
                shortcode={shortcode as TWalletShortcode}
                is_open_wallet={active}
                setIsOpen={setActive}
                icon_type={wallet_account.icon_type}
                icon={wallet_account.icon}
            />
            <CSSTransition appear in={active} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent is_demo={!!is_demo} is_eu={shortcode === 'malta'} wallet_account={wallet_account} />
            </CSSTransition>
        </div>
    );
});
Wallet.displayName = 'Wallet';
export default Wallet;
