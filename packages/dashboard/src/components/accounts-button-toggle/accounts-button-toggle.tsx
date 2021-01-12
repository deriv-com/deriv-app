import * as React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ButtonToggle } from '@deriv/components';

interface TAccountsButtonToggleProps {
    onChangeAccount: (item: string) => void;
    highlight_color?: string;
    className?: string;
    [k: string]: unknown;
}

const AccountsButtonToggle: React.FC<TAccountsButtonToggleProps> = ({
    onChangeAccount,
    highlight_color,
    className,
    ...props
}) => {
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
                highlight_color={highlight_color}
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

export default AccountsButtonToggle;
