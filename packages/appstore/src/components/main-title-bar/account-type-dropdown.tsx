import { account_types, AccountType } from 'Constants/platform-config';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import classNames from 'classnames';
import React from 'react';
import './account-type-dropdown.scss';

const AccountTypeDropdown = () => {
    const { tradinghub } = useStores();

    return (
        <select
            className={classNames(
                'account-type-dropdown',
                `account-type-dropdown--${tradinghub.selected_account_type}`
            )}
            value={tradinghub.selected_account_type}
            onChange={e => tradinghub.selectAccountType(e.target.value)}
        >
            {account_types.map((account_type: AccountType) => (
                <option key={account_type} className='account-type-dropdown__item' value={account_type}>
                    {account_type}
                </option>
            ))}
        </select>
    );
};

export default observer(AccountTypeDropdown);
