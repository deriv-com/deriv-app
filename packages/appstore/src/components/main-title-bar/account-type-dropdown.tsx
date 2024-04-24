import React from 'react';
import classNames from 'classnames';
import { Dropdown } from '@deriv/components';
import { Analytics } from '@deriv-com/analytics';
import { getAccountTypes } from 'Constants/platform-config';
import { useStore, observer } from '@deriv/stores';
import './account-type-dropdown.scss';

const AccountTypeDropdown = observer(() => {
    const { traders_hub, client, common } = useStore();
    const { selected_account_type, selectAccountType } = traders_hub;
    const { setPrevAccountType } = client;
    const { current_language } = common;

    return (
        <div className={classNames('account-type-dropdown--parent')}>
            <Dropdown
                classNameIcon={`account-type-dropdown__icon--${selected_account_type}`}
                value={selected_account_type}
                classNameDisplay={classNames(
                    'account-type-dropdown',
                    `account-type-dropdown--${selected_account_type}`
                )}
                list={getAccountTypes()}
                key={`account-type-dropdown__icon--key-${current_language}`}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    await selectAccountType(e.target.value);
                    await setPrevAccountType(e.target.value);
                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                        action: 'switch_account_mode',
                        form_name: 'traders_hub_default',
                        account_mode: selected_account_type,
                    });
                }}
            />
        </div>
    );
});

export default AccountTypeDropdown;
