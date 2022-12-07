import React from 'react';
import './account-type-dropdown.scss';

const AccountTypeDropdown = () => {
    return (
        <select className='account-type-dropdown'>
            <option className='account-type-dropdown__item'>Real</option>
            <option>Demo</option>
        </select>
    );
};

export default AccountTypeDropdown;
