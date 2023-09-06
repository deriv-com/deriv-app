import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';

type TAccountsListProps = {
    data: ReturnType<typeof useActiveWalletAccount>['data'];
};

const AccountsList = ({ data }: TAccountsListProps) => {
    return <div className='wallets-accounts-list'>{data?.loginid}</div>;
};

export default AccountsList;
