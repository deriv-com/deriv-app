import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Button }   from 'deriv-components';
import { localize } from 'App/i18n';

const SignupButtonComponent = ({ className }) => (
    <Button
        id='dt_signup_button'
        className={classNames(className, 'btn--primary btn--primary--orange')}
        has_effect
        text={localize('Sign up')}
        onClick={() => { window.open('https://deriv.com'); }}
    />
);

SignupButtonComponent.propTypes = {
    className: PropTypes.string,
};

export const SignupButton = React.memo(SignupButtonComponent)
