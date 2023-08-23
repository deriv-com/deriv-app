import React from 'react';
import { Popover } from '@deriv/components';

type TAccountInfoWrapper = {
    is_disabled?: boolean;
    disabled_message: string;
};

const AccountInfoWrapper = ({
    is_disabled,
    disabled_message,
    children,
}: React.PropsWithChildren<TAccountInfoWrapper>) =>
    is_disabled && disabled_message ? (
        <Popover alignment='left' message={disabled_message} zIndex={'99999'}>
            {children}
        </Popover>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );

export default AccountInfoWrapper;
