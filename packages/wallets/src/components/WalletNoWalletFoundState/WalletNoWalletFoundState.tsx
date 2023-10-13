import React from 'react';
import { useHistory } from 'react-router-dom';
import NoWalletIcon from '../../public/images/no-wallet.svg';
import './WalletNoWalletFoundState.scss';

const WalletNoWalletFoundState = () => {
    const history = useHistory();
    return (
        <div className='wallets-no-wallet-found-state'>
            <NoWalletIcon height={100} width={100} />
            <h4 className='wallets-no-wallet-found-state__title'>You have no wallet account 🐣</h4>
            <p className='wallets-no-wallet-found-state__description'>
                Disable the <span onClick={() => history.push('/endpoint')}>next_wallet</span> feature flag to see
                Trader&apos;s Hub{' '}
            </p>
        </div>
    );
};

export default WalletNoWalletFoundState;
