import PropTypes           from 'prop-types';
import React               from 'react';
import { Button }          from 'deriv-components';
import { redirectToLogin } from '_common/base/login';
import { localize }        from 'deriv-translations';

const LoginButton = ({ className }) => (
    <Button
        id='dt_login_button'
        className={className}
        has_effect
        text={localize('Log in')}
        onClick={redirectToLogin}
        tertiary
    />
);

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
