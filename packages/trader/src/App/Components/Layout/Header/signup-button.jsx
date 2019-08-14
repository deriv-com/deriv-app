import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { localize }        from 'App/i18n';
import { urlFor }          from '_common/url';
import Button              from 'deriv-components/lib/button';

const openSignUp = () => {
    window.open(urlFor('new-account', undefined, undefined, true));
};

const SignupButtonComponent = ({ className }) => (
    <Button
        className={classNames(className, 'btn--primary btn--primary--orange')}
        has_effect
        text={localize('Sign up')}
        onClick={openSignUp}
    />
);

SignupButtonComponent.propTypes = {
    className: PropTypes.string,
};

export const SignupButton = React.memo(SignupButtonComponent)
