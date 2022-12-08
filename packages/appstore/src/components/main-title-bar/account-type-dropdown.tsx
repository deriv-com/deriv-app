import { account_types, AccountType } from 'Constants/platform-config';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import classNames from 'classnames';
import React from 'react';
import './account-type-dropdown.scss';

const AccountTypeDropdown = () => {
    const { tradinghub, client } = useStores();
    return (
        <select
            className={classNames(
                'account-type-dropdown',
                `account-type-dropdown${tradinghub.current_account_type === 'real' ? '--real' : '--demo'}`
            )}
            value={tradinghub.current_account_type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                client.switchAccountHandlerForAppstore(e.target.value);
                tradinghub.setCurrentAccountType(e.target.value);
            }}
        >
            {account_types.map((account_type: AccountType) => (
                <option className='account-type-dropdown__item' value={account_type} key={account_type}>
                    {account_type}
                </option>
            ))}
        </select>
    );
};

export default observer(AccountTypeDropdown);
