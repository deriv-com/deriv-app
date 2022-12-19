import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Dropdown } from '@deriv/components';
import { account_types } from 'Constants/platform-config';
import { useStores } from 'Stores';
import './account-type-dropdown.scss';

const AccountTypeDropdown = () => {
    const { traders_hub } = useStores();
    const { selected_account_type, selectAccountType } = traders_hub;

    return (
        <div className={classNames('account-type-dropdown--parent')}>
            <Dropdown
                classNameIcon={`account-type-dropdown__icon--${selected_account_type}`}
                value={selected_account_type}
                classNameDisplay={classNames(
                    'account-type-dropdown',
                    `account-type-dropdown--${selected_account_type}`
                )}
                list={account_types}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectAccountType(e.target.value)}
            />
        </div>
    );
};

export default observer(AccountTypeDropdown);
