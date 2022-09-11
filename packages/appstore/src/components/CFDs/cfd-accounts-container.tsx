import React from 'react';
import CFDDemoAccounts from './cfd-demo-accounts';
import CFDRealAccounts from './cfd-real-accounts';

type TCFDAccountsProps = {
    is_demo: boolean;
};

const CFDAccounts = ({ is_demo }: TCFDAccountsProps) => {
    return <div className='cfd-accounts-container'>{is_demo ? <CFDDemoAccounts /> : <CFDRealAccounts />}</div>;
};

export default CFDAccounts;
