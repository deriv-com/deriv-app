import React, { useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useStaleWalletsList } from '@deriv/api';
import { AccountsList } from '../AccountsList';
import { WalletsAccordionLoader } from '../SkeletonLoader';
import { WalletListCard } from '../WalletListCard';
import { WalletsAccordion } from '../WalletsAccordion';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: wallets, isLoading: isWalletAccountsListLoading } = useStaleWalletsList();
    const { data: activeWallet } = useActiveWalletAccount();

    const { switchAccount } = useAuthorize();

    const [selectedLoginId, setSelectedLoginId] = useState(activeWallet?.loginid);

    function onWalletToggle(loginid: string) {
        if (loginid !== activeWallet?.loginid) {
            setSelectedLoginId(loginid);
            switchAccount(loginid);
        }
    }

    return (
        <div className='wallets-desktop-wallets-list'>
            {isWalletAccountsListLoading && <WalletsAccordionLoader />}
            {wallets?.map(account => {
                return (
                    <WalletsAccordion
                        isDemo={account.is_virtual}
                        isOpen={account.loginid == selectedLoginId}
                        key={`wallets-accordion-${account.loginid}`}
                        onToggle={onWalletToggle.bind(this, account.loginid)}
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
