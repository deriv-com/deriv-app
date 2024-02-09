import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api';
import { AccountsList } from '../AccountsList';
import { WalletsCardLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsCard } from '../WalletsCard';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: activeWallet, refetch: refetchActiveWallet } = useActiveWalletAccount();
    const { isLoading: isAuthorizeLoading } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const [selectedAccount, setSelectedAccount] = useState<string>('USD');

    useEffect(() => {
        if (selectedAccount) {
            refetchActiveWallet();
        }
    }, [selectedAccount, refetchActiveWallet]);

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
                            onAccountSelect={loginid => setSelectedAccount(loginid)}
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
