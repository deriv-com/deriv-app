import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { TWalletAccount } from 'Types';
import './wallet.scss';

type TWallet = {
    wallet_account: TWalletAccount;
};

const Wallet = ({ wallet_account }: TWallet) => {
    const is_demo = wallet_account.is_virtual;
    const active = wallet_account.is_selected;

    return (
        <div
            className={classNames('wallet', {
                wallet__demo: is_demo,
            })}
        >
            <WalletHeader wallet_account={wallet_account} />
            <CSSTransition appear in={active} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent is_demo={!!is_demo} is_eu={wallet_account.landing_company_name === 'malta'} />
            </CSSTransition>
        </div>
    );
};

export default Wallet;
