import React from 'react';
import { CFDList } from '../CFDList';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import './AccountsList.scss';

const AccountsList = () => {
    return (
        <div className='wallets-accounts-list'>
            <div className='wallets-accounts-list__content'>
                <CFDList />
                <OptionsAndMultipliersListing />
            </div>
        </div>
    );
};

export default AccountsList;
