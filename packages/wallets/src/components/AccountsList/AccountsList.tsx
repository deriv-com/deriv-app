import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './AccountsList.scss';

type TAccountsListProps = {
    data: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const AccountsList = ({ data }: TAccountsListProps) => {
    return (
        <div className='wallets-accounts-list'>
            <div className='wallets-accounts-list__content'>
                <h1>CFDs</h1>
                <p>Trade with leverage and tight spreads for better returns on trades. Learn more</p>
            </div>
        </div>
    );
};

export default AccountsList;
