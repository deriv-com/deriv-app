import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCardLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsContainer } from '../WalletsContainer';
import './DesktopWalletsList.scss';

const DesktopWalletsList = () => {
    const { isInitializing } = useActiveWalletAccount();

    return (
        <div className='wallets-desktop-wallets-list' data-testid='dt_desktop-wallets-list'>
            {isInitializing && <WalletsCardLoader />}
            {!isInitializing && (
                <WalletsContainer renderHeader={() => <WalletListCard />}>
                    <AccountsList />
                </WalletsContainer>
            )}
        </div>
    );
};

export default DesktopWalletsList;
