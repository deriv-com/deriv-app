import { account_types } from 'Constants/platform-config';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import classNames from 'classnames';
import React from 'react';
import './account-type-dropdown.scss';
import { Dropdown } from '@deriv/components';

const AccountTypeDropdown = () => {
    const { tradinghub } = useStores();

    return (
        <div className={classNames('account-type-dropdown--parent')}>
            <Dropdown
                classNameIcon={`account-type-dropdown__icon--${tradinghub.selected_account_type}`}
                value={tradinghub.selected_account_type}
                classNameDisplay={classNames(
                    'account-type-dropdown',
                    `account-type-dropdown--${tradinghub.selected_account_type}`
                )}
                list={account_types}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => tradinghub.selectAccountType(e.target.value)}
            />
        </div>
    );
};

export default observer(AccountTypeDropdown);
