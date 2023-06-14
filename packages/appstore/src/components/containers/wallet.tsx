import React from 'react';
import classNames from 'classnames';
import WalletHeader from 'Components/wallet-header';
import WalletContent from 'Components/wallet-content';
import { CSSTransition } from 'react-transition-group';
import { observer, useStore } from '@deriv/stores';
import { TWalletAccount } from 'Types';
import './wallet.scss';

type TWallet = {
    data: TWalletAccount;
};

const Wallet = observer(({ data }: TWallet) => {
    const { client } = useStore();
    const { loginid } = client;
    const is_active = loginid === data.loginid;

    return (
        <div className={classNames('wallet', { wallet__demo: data.is_demo })}>
            <WalletHeader data={data} />
            <CSSTransition appear in={is_active} timeout={240} classNames='wallet__content-transition' unmountOnExit>
                <WalletContent data={data} />
            </CSSTransition>
        </div>
    );
});
export default Wallet;
