import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { observer } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import './wallet.scss';

type TWallet = {
    wallet_account: TWalletAccount;
};

const Wallet = observer(({ wallet_account }: TWallet) => {
    const headerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    return (
        <div ref={headerRef} className={classNames('wallet', { wallet__demo: wallet_account.is_demo })}>
            <WalletHeader wallet_account={wallet_account} />
            <CSSTransition
                appear
                in={wallet_account.is_selected}
                timeout={240}
                onEntered={() => {
                    headerRef.current.style.scrollMargin = '20px';
                    headerRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                classNames='wallet__content-transition'
                unmountOnExit
            >
                <WalletContent wallet_account={wallet_account} />
            </CSSTransition>
        </div>
    );
});
export default Wallet;
