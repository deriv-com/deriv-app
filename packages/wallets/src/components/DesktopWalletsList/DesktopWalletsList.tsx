import React from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCardLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsCard } from '../WalletsCard';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { isLoading: isAuthorizeLoading } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = isActiveWalletLoading || isAuthorizeLoading || isCurrencyConfigLoading;

    return (
        <div className='wallets-desktop-wallets-list'>
            {isLoading && <WalletsCardLoader />}
            {!isLoading && (
                <WalletsCard
                    key={activeWallet && `wallets-card-${activeWallet?.loginid}`}
                    renderHeader={() => <WalletListCard />}
                >
                    <AccountsList />
                </WalletsCard>
            )}
        </div>
    );
};

export default DesktopWalletsList;
