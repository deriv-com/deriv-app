import React from 'react';
import { useHistory } from 'react-router-dom';
import useDevice from '../../hooks/useDevice';
import NoWalletIcon from '../../public/images/no-wallet.svg';
import { WalletButton, WalletText } from '../Base';
import './WalletNoWalletFoundState.scss';

const WalletNoWalletFoundState: React.FC = () => {
    const { isMobile } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-no-wallet-found-state'>
            <NoWalletIcon height={300} width={300} />
            <div className='wallets-no-wallet-found-state__container'>
                <div className='wallets-no-wallet-found-state__content'>
                    <WalletText size='3xl' weight='bold'>
                        You have no wallet account 🐣
                    </WalletText>
                    <WalletText size={isMobile ? 'sm' : 'md'}>
                        Disable the <span className='wallets-no-wallet-found-state__emphasized-text'>next_wallet</span>{' '}
                        feature flag to see Trader&apos;s Hub.
                    </WalletText>
                </div>
                <WalletButton onClick={() => history.push('/endpoint')} size='lg'>
                    Endpoint
                </WalletButton>
            </div>
        </div>
    );
};

export default WalletNoWalletFoundState;
