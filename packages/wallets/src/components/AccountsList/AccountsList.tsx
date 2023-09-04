import React from 'react';

type TAccountsListProps = {
    data: {
        text: string;
        background: string;
    };
};

const AccountsList = ({ data }: TAccountsListProps) => {
    return (
        <div className='wallets-accounts-list' style={{ backgroundColor: data.background }}>
            AccountsList
        </div>
    );
};

export default AccountsList;
