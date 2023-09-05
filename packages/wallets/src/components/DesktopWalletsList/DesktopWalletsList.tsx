import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletsAccordionContainer } from '..';

const DesktopWalletsList: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1>No wallets found</h1>;

    return (
        <React.Fragment>
            <WalletsAccordionContainer wallets_list={data} />
        </React.Fragment>
    );
};

export default DesktopWalletsList;
