import React from 'react';
import classNames from 'classnames';
import { ButtonToggle } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import './account-type-dropdown.scss';

const AccountTypeToggleButton = observer(() => {
    const { traders_hub, client } = useStore();
    const { selected_account_type, selectAccountType } = traders_hub;
    const { setPrevAccountType } = client;

    const AccountType = [
        { text: 'Real', value: 'real' },
        { text: 'Demo', value: 'demo' },
    ];
    return (
        <div className={classNames('account-type-dropdown--parent')}>
            <ButtonToggle
                buttons_arr={AccountType}
                className='traders-hub__button-toggle'
                has_rounded_button
                name='account_type'
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    await selectAccountType(e.target.value);
                    await setPrevAccountType(e.target.value);
                }}
                value={selected_account_type}
            />
        </div>
    );
});

export default AccountTypeToggleButton;
