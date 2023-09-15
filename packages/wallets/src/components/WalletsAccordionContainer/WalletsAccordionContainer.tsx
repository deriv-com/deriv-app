import React, { useState } from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { AccountsList, WalletListCard, WalletsAccordion } from '..';
import './WalletsAccordionContainer.scss';

type TProps = {
    wallets_list: ReturnType<typeof useWalletAccountsList>['data'];
};

const WalletsAccordionContainer: React.FC<TProps> = ({ wallets_list }) => {
    const [active_account, setActiveAccount] = useState(wallets_list.find(account => account.is_active)?.loginid);

    const swithAccount = (loginid?: string) => {
        if (!loginid) return;

        setActiveAccount(loginid);
        // implement switch account here
    };

    return (
        <div className='wallets-accordion-container'>
            {wallets_list.map(account => {
                return (
                    <WalletsAccordion
                        key={`wallets-accordion-${account.loginid}`}
                        active_account={active_account}
                        account_info={account}
                        switchAccount={swithAccount}
                        header={<WalletListCard account={account} />}
                        content={<AccountsList />}
                    />
                );
            })}
        </div>
    );
};

export default WalletsAccordionContainer;
