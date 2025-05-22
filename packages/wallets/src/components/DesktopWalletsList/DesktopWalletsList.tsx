import React from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useIsEuRegion } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCardLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsContainer } from '../WalletsContainer';
import './DesktopWalletsList.scss';

const DesktopWalletsList = () => {
    const { data: activeWallet, isInitializing } = useActiveWalletAccount();
    const { data: isEuRegion } = useIsEuRegion();
    return (
        <div
            className={classNames('wallets-desktop-wallets-list', {
                'wallets-desktop-wallets-list--with-banner': isEuRegion && !activeWallet?.is_virtual,
            })}
            data-testid='dt_desktop-wallets-list'
        >
            {isInitializing && <WalletsCardLoader />}
            {!isInitializing && (
                <WalletsContainer
                    key={activeWallet && `wallets-card-${activeWallet?.loginid}`}
                    renderHeader={() => <WalletListCard />}
                >
                    <AccountsList />
                </WalletsContainer>
            )}
        </div>
    );
};

export default DesktopWalletsList;
