import React from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCardLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsCard } from '../WalletsCard';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isLoading: isAuthorizeLoading, switchAccount } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    return (
        <div className='wallets-desktop-wallets-list'>
            {(isAuthorizeLoading || isCurrencyConfigLoading) && <WalletsCardLoader />}
            {activeWallet && (
                <WalletsCard
                    isDemo={activeWallet?.is_virtual}
                    key={`wallets-card-${activeWallet?.loginid}`}
                    renderHeader={() => (
                        <WalletListCard
                            balance={activeWallet?.display_balance}
                            currency={activeWallet?.wallet_currency_type || 'USD'}
                            isActive={activeWallet?.is_active}
                            isDemo={activeWallet.is_virtual}
                            loginid={activeWallet?.loginid}
                            onAccountSelect={loginid => switchAccount(loginid)}
                        />
                    )}
                >
                    <AccountsList />
                </WalletsCard>
            )}
        </div>
    );
};

export default DesktopWalletsList;
