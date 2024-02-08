import React from 'react';
import { useAuthorize, useCurrencyConfig, useWalletAccountsList } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsAccordionLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsAccordion } from '../WalletsAccordion';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: wallets } = useWalletAccountsList();
    const { isLoading: isAuthorizeLoading, switchAccount } = useAuthorize();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    return (
        <div className='wallets-desktop-wallets-list'>
            {(isAuthorizeLoading || isCurrencyConfigLoading) && <WalletsAccordionLoader />}
            {wallets?.map(account => {
                return (
                    <WalletsAccordion
                        isDemo={account.is_virtual}
                        isOpen={account.is_active}
                        key={`wallets-accordion-${account.loginid}`}
                        onToggle={() => switchAccount(account.loginid)}
                        renderHeader={() => (
                            <WalletListCard
                                badge={account.landing_company_name}
                                balance={account.display_balance}
                                currency={account.wallet_currency_type || 'USD'}
                                isActive={account.is_active}
                                isDemo={account.is_virtual}
                                loginid={account.loginid}
                                title={account.currency || 'USD'}
                            />
                        )}
                    >
                        <AccountsList />
                    </WalletsAccordion>
                );
            })}
        </div>
    );
};

export default DesktopWalletsList;
