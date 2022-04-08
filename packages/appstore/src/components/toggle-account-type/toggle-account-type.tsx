import React from 'react';
import { ButtonToggle } from '@deriv/components';

type TAccountTypeProps = {
    accountTypeChange: any;
    value: string;
};

const ToggleAccountType = ({ accountTypeChange, value }: TAccountTypeProps) => {
    const toggle_options = [
        { text: 'Real', value: 'Real' },
        { text: 'Demo', value: 'Demo' },
    ];

    return (
        <div className='toggle-account-type'>
            <ButtonToggle
                buttons_arr={toggle_options}
                className='toggle-account-type__button'
                has_rounded_button
                is_animated
                name='account_type'
                onChange={accountTypeChange}
                value={value}
            />
        </div>
    );
};

export default ToggleAccountType;
