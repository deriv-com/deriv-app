import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './AccountsList.scss';

type TAccountsListProps = {
    data: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const AccountsList = ({ data }: TAccountsListProps) => {
    return <div className='wallets-accounts-list'>{data.loginid}</div>;
};

export default AccountsList;
