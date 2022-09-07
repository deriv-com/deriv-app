import PropTypes from 'prop-types';
import React from 'react';
import { redirectToLogin, redirectToSignUp } from '@deriv/shared';
import { getLanguage , localize } from '@deriv/translations';
import { DesktopWrapper, MobileWrapper, Button} from '@deriv/components';

const SignupButton = ({ className, is_appstore }) => (
    <>
    <DesktopWrapper>
    <Button
        id='dt_signup_button'
        className={className}
        has_effect
        text={localize('Sign up')}
        onClick={() => redirectToSignUp({ is_appstore })}
        primary
    />
    </DesktopWrapper>
    <MobileWrapper>
    <Button
        id='dt_signup_button'
        className={className}
        has_effect
        text={localize('Sign up')}
        onClick={() => redirectToLogin(false, getLanguage())}
        primary
    />
    </MobileWrapper>
    </>
);

SignupButton.propTypes = {
    className: PropTypes.string,
    is_appstore: PropTypes.bool,
};

export { SignupButton };
