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
    const headerRef = React.useRef<HTMLDivElement>(null);
    const { is_selected, is_demo, is_malta_wallet } = wallet_account;

    return (
        <div ref={headerRef} className={classNames('wallet', { wallet__demo: is_demo })}>
            <WalletHeader wallet_account={wallet_account} />
            <CSSTransition
                appear
                in={is_selected}
                timeout={240}
                onEntered={() => {
                    if (headerRef?.current) {
                        headerRef.current.style.scrollMargin = '20px';
                        headerRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                classNames='wallet__content-transition'
                unmountOnExit
            >
                <WalletContent is_demo={is_demo} is_malta_wallet={is_malta_wallet} />
            </CSSTransition>
        </div>
    );
};

export default Wallet;
