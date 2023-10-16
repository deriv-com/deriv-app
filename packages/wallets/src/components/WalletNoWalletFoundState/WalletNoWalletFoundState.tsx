import React from 'react';
import { useHistory } from 'react-router-dom';
import useDevice from '../../hooks/useDevice';
import NoWalletIcon from '../../public/images/no-wallet.svg';
import { WalletButton, WalletText } from '../Base';
import './WalletNoWalletFoundState.scss';

const WalletNoWalletFoundState = () => {
    const { isMobile } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-no-wallet-found-state'>
            <NoWalletIcon height={300} width={300} />
            <div className='wallets-no-wallet-found-state-content__container'>
                <div className='wallets-no-wallet-found-state-content'>
                    <WalletText size='3xl' weight='bold'>
                        You have no wallet account 🐣
                    </WalletText>
                    <WalletText size={isMobile ? 'sm' : 'md'}>
                        Disable the{' '}
                        <span className='wallets-no-wallet-found-state-content__emphasize-text'>next_wallet</span>{' '}
                        feature flag to see Trader&apos;s Hub.
                    </WalletText>
                </div>
                <WalletButton
                    // @ts-expect-error putting `/endpoint` here because this component is only for internal use.
                    onClick={() => history.push('/endpoint')}
                    size='lg'
                >
                    <WalletText color='white' size='sm' weight='bold'>
                        Endpoint
                    </WalletText>
                </WalletButton>
            </div>
        </div>
    );
};

export default WalletNoWalletFoundState;
