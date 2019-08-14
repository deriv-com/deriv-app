import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import Button              from 'deriv-components/lib/button';
import { redirectToLogin } from '_common/base/login';
import { localize }        from 'App/i18n';

const LoginButtonComponent = ({ className }) => (
    <Button
        className={classNames(className, 'btn--secondary btn--secondary--orange')}
        has_effect
        text={localize('Log in')}
        onClick={redirectToLogin}
    />
);

LoginButtonComponent.propTypes = {
    className: PropTypes.string,
};

export const LoginButton = React.memo(LoginButtonComponent);
