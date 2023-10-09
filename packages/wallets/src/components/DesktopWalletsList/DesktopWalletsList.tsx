import React from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import { AccountsList } from '../AccountsList';
import { WalletListCard } from '../WalletListCard';
import { WalletsAccordion } from '../WalletsAccordion';
import './DesktopWalletsList.scss';

const DesktopWalletsList: React.FC = () => {
    const { data: wallets } = useWalletAccountsList();
    const { switchAccount } = useAuthorize();

    return (
        <div className='wallets-desktop-wallets-list'>
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
