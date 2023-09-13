import React from 'react';
import { OptionsAndMultipliersListing } from '..';
import './AccountsList.scss';

const AccountsList = () => {
    return (
        <div className='wallets-accounts-list'>
            <div className='wallets-accounts-list__content'>
                <OptionsAndMultipliersListing />
            </div>
        </div>
    );
};

export default AccountsList;
