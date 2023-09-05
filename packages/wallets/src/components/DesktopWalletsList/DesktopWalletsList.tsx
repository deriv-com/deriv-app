import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { AccountsList, WalletListCard, WalletsAccordion } from '..';

const DesktopWalletsList: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1>No wallets found</h1>;

    return (
        <React.Fragment>
            {data?.map(account => {
                return (
                    <WalletsAccordion
                        key={account.loginid}
                        header={<WalletListCard account={account} />}
                        content={<AccountsList data={account} />}
                    />
                );
            })}
        </React.Fragment>
    );
};

export default DesktopWalletsList;
