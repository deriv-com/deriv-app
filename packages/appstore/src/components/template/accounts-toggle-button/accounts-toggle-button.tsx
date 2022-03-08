import * as React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ButtonToggle } from '@deriv/components';

type TAccountsToggleButtonProps = {
    onChangeAccount: (item: string) => void;
    className?: string;
    [k: string]: unknown;
};

const AccountsToggleButton: React.FC<TAccountsToggleButtonProps> = ({ onChangeAccount, className, ...props }) => {
    const [selected, setSelected] = React.useState<string>('DEMO');
    const getAccountTypes = () => {
        return [
            {
                text: localize('Demo'),
                value: 'DEMO',
            },
            {
                text: localize('Real'),
                value: 'REAL',
            },
        ];
    };

    return (
        <div className='button-toggle__container'>
            <ButtonToggle
                buttons_arr={getAccountTypes()}
                className={classNames('button-toggle__items', className)}
                is_animated
                has_rounded_button
                name='account types'
                onChange={(item: React.ChangeEvent<HTMLInputElement>) => {
                    onChangeAccount(item.target.value);
                    setSelected(item.target.value);
                }}
                value={selected}
                {...props}
            />
        </div>
    );
};

export default AccountsToggleButton;
