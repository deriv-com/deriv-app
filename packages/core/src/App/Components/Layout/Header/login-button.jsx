import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { redirectToSignUp } from '@deriv/shared';
import { localize } from '@deriv/translations';

const LoginButton = ({ className, is_appstore }) => (
    <Button
        id='dt_login_button'
        className={className}
        has_effect
        text={localize('Log in')}
        onClick={() => redirectToSignUp({ is_appstore })}
        tertiary
    />
);

LoginButton.propTypes = {
    className: PropTypes.string,
    is_appstore: PropTypes.bool,
};

export { LoginButton };
