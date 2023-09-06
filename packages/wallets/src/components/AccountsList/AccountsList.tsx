import React from 'react';
import { useWalletAccountsList } from '@deriv/api';

type TAccountsListProps = {
    data: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const AccountsList = ({ data }: TAccountsListProps) => {
    return <div className='wallets-accounts-list'>{data?.loginid}</div>;
};

export default AccountsList;
