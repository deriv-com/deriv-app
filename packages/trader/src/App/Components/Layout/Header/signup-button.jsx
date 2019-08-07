import classNames          from 'classnames';
import { Button }          from 'deriv-components';
import PropTypes           from 'prop-types';
import React               from 'react';
import { localize }        from 'App/i18n';

const openSignUp = () => {
    window.open('https://deriv.com');
};

const SignupButtonComponent = ({ className }) => (
    <Button
        id='dt_signup_button'
        className={classNames(className, 'btn--primary btn--primary--orange')}
        has_effect
        text={localize('Sign up')}
        onClick={openSignUp}
    />
);

SignupButtonComponent.propTypes = {
    className: PropTypes.string,
};

export const SignupButton = React.memo(SignupButtonComponent);
