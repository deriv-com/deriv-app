import PropTypes from 'prop-types';
import React from 'react';
import { Button, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { redirectToSignUp, redirectToLogin } from '@deriv/shared';
import {localize, getLanguage } from '@deriv/translations';

// eslint-disable-next-line react/prop-types
const LoginButton = ({ className, is_appstore }) => (
    <>
    <DesktopWrapper>
         <Button
        id='dt_login_button'
        className={className}
        has_effect
        text={localize('Log in')}
        onClick={() => redirectToLogin(false, getLanguage())}
        tertiary
    />
        </DesktopWrapper>
        <MobileWrapper>
    <Button
        id='dt_login_button'
        className={className}
        has_effect
        text={localize('Log in')}
        onClick={() => redirectToSignUp({ is_appstore })}
        tertiary
    />
    </MobileWrapper>
    </>
);

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
