import React from 'react';
import { Button } from '@deriv/components';
import { redirectToSignUp } from '@deriv/shared';
import { localize } from '@deriv/translations';

type SignupButtonProps = {
    className: string;
    is_dashboard: boolean;
};

const SignupButton = ({ className, is_dashboard }: SignupButtonProps) => (
    <Button
        id='dt_signup_button'
        className={className}
        has_effect
        text={localize('Sign up')}
        onClick={() => redirectToSignUp({ is_dashboard })}
        primary
    />
);

export { SignupButton };
