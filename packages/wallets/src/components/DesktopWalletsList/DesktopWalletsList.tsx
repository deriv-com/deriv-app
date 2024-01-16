import React from 'react';
import { useAuthorize, useCurrencyConfig, useWalletAccountsList } from '@deriv/api';
import { AccountsList } from '../AccountsList';
import { WalletsAccordionLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsAccordion } from '../WalletsAccordion';
import './DesktopWalletsList.scss';
import AccountSwitcher from './AccountSwitcher/AccountSwitcher';

const DesktopWalletsList: React.FC = () => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeAccount, isLoading: isAuthorizeLoading, switchAccount } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    if (isAuthorizeLoading || isCurrencyConfigLoading) {
        return (
            <div className='wallets-desktop-wallets-list'>
                <WalletsAccordionLoader />
            </div>
        );
    }

    return (
        <div className='wallets-desktop-wallets-list'>

            <div
            className={`wallets-accordion wallets-accordion ${
                activeAccount.is_virtual ? 'wallets-accordion wallets-accordion--virtual' : ''
            }`}
            >
                <AccountSwitcher 
                    accountsList={wallets}
                    activeWallet={activeAccount}
                    label={`Wallet ${activeAccount?.currency}`}
                    onSelect={(account) => {
                        switchAccount(account.loginid);
                    }}
                    selectedAccount={activeAccount}
                />

                <div
                    className={`wallets-accordion__header wallets-accordion__header ${
                        activeAccount.is_active ? 'wallets-accordion__header wallets-accordion__header--virtual' : ''
                    }`}
                >
                    <WalletListCard
                        badge={activeAccount.landing_company_name}
                        balance={activeAccount.display_balance}
                        currency={activeAccount.wallet_currency_type || 'USD'}
                        isActive={true}
                        isDemo={!!activeAccount.is_virtual}
                        loginid={activeAccount.loginid}
                        title={activeAccount.currency || 'USD'}></WalletListCard>
                                
                </div>

                <div className={`wallets-accordion__content ${'wallets-accordion__content--visible'}`}>
                    <AccountsList />
                </div>
            </div>
        </div>
    );
};

export default DesktopWalletsList;
