import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import './account-type-active-tab.scss';

const AccountTypeTab = observer(() => {
    const { traders_hub, client } = useStore();
    const { selected_account_type, selectAccountType } = traders_hub;
    const { setPrevAccountType } = client;

    const AccountType = [
        { text: 'Demo', value: 'demo' },
        { text: 'Real', value: 'real' },
    ];
    return (
        <ButtonToggle
            buttons_arr={AccountType}
            className='account_type'
            has_rounded_button
            name='platform_type'
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                await selectAccountType(e.target.value);
                await setPrevAccountType(e.target.value);
            }}
            value={selected_account_type}
        />
    );
});

export default AccountTypeTab;
