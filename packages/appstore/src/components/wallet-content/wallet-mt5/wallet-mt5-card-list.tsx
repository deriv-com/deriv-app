import React from 'react';
import { observer } from '@deriv/stores';
import { useFilteredCFDAccounts } from '@deriv/hooks';
import AddedMT5Card from './added-mt5-card';
import AvailableMT5Card from './available-mt5-card';

const WalletMT5CardList = observer(() => {
    const { data: filtered_cfd_accounts } = useFilteredCFDAccounts();

    return (
        <React.Fragment>
            {filtered_cfd_accounts?.map((account, index) => {
                const list_size = filtered_cfd_accounts.length || 0;

                if (account.is_added) {
                    return (
                        <AddedMT5Card key={`${account.login}`} account={account} index={index} list_size={list_size} />
                    );
                }

                return <AvailableMT5Card key={`${account.market_type}${index}`} account={account} />;
            })}
        </React.Fragment>
    );
});

export default WalletMT5CardList;
