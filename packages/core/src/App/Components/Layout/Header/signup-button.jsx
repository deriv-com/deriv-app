import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { redirectToSignUp } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import './login-button.scss';
import { useOauth2 } from '@deriv/hooks';

const SignupButton = observer(({ className }) => {
    const { client } = useStore();
    const { is_client_store_initialized, is_single_logging_in } = client;
    const { isOAuth2Enabled } = useOauth2({});

    if (isOAuth2Enabled && (!is_client_store_initialized || is_single_logging_in)) {
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
