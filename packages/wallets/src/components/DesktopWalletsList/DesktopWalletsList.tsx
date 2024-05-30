import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TSubscribedBalance } from '../../types';
import { AccountsList } from '../AccountsList';
import { WalletsCardLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsContainer } from '../WalletsContainer';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: activeWallet, isInitializing } = useActiveWalletAccount();

    return (
        <div className='wallets-desktop-wallets-list'>
            {isInitializing && <WalletsCardLoader />}
            {!isInitializing && (
                <WalletsContainer
                    key={activeWallet && `wallets-card-${activeWallet?.loginid}`}
                    renderHeader={() => <WalletListCard balance={balance} />}
                >
                    <AccountsList balance={balance} />
                </WalletsContainer>
            )}
        </div>
    );
};

export default DesktopWalletsList;
