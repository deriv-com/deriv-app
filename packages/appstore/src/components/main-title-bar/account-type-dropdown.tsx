import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { account_types } from 'Constants/platform-config';
import { useStores } from 'Stores';
import { TAccountCategory } from 'Types';
import './account-type-dropdown.scss';

const AccountTypeDropdown = () => {
    const { traders_hub } = useStores();

    return (
        <select
            className={classNames(
                'account-type-dropdown',
                `account-type-dropdown--${traders_hub.selected_account_type}`
            )}
            value={traders_hub.selected_account_type}
            onChange={e => traders_hub.selectAccountType(e.target.value)}
        >
            {account_types.map((account_type: TAccountCategory) => (
                <option key={account_type} className='account-type-dropdown__item' value={account_type}>
                    {account_type}
                </option>
            ))}
        </select>
    );
};

export default observer(AccountTypeDropdown);
