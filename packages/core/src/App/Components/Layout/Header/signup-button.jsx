import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { redirectToSignUp } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';

const SignupButton = observer(({ className }) => {
    const { client } = useStore();
    const { is_single_logging_in } = client;

    if (is_single_logging_in) {
        return <div className='skeleton-loader' />;
    }

    return (
        <Button
            id='dt_signup_button'
            className={className}
            has_effect
            text={localize('Sign up')}
            onClick={redirectToSignUp}
            primary
        />
    );
});

SignupButton.propTypes = {
    className: PropTypes.string,
};

export { SignupButton };
