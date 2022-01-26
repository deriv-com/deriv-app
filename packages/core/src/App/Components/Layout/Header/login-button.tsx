import React from 'react';
import { Button } from '@deriv/components';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';

type LoginButtonProps = {
    className: string;
};

const LoginButton = ({ className }: LoginButtonProps) => (
    <Button
        id='dt_login_button'
        className={className}
        has_effect
        text={localize('Log in')}
        onClick={() => redirectToLogin(false, getLanguage())}
        tertiary
    />
);

export { LoginButton };
