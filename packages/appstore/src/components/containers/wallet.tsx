import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { TWalletAccount, TWalletCurrency } from 'Types';
import './wallet.scss';

type TWallet = {
    wallet_account: TWalletAccount;
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const Wallet = ({ wallet_account, active, setActive }: TWallet) => {
    const is_demo = wallet_account.is_virtual;

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
                shortcode={wallet_account.landing_company_shortcode}
                is_open_wallet={active}
                setIsOpen={setActive}
                icon_type={wallet_account.icon_type}
                icon={wallet_account.icon}
            />
            <CSSTransition appear in={active} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent
                    is_demo={!!is_demo}
                    is_eu={wallet_account.landing_company_shortcode === 'malta'}
                    wallet_account={wallet_account}
                />
            </CSSTransition>
        </div>
    );
};
Wallet.displayName = 'Wallet';
export default Wallet;
