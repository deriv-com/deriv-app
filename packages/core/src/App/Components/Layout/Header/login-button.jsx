import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { useOauth2 } from '@deriv/hooks';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';

import './login-button.scss';

const PulsatingSkeleton = () => <div className='skeleton-loader' />;

const LoginButton = ({ className }) => {
    const { isOAuth2Enabled } = useOauth2({});
    const isUserLoggedState = Cookies.get('logged_state') === 'true';

    if (isUserLoggedState) {
        return <PulsatingSkeleton className={className} />;
    }

    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                if (isOAuth2Enabled) {
                    await requestOidcAuthentication({
                        redirectCallbackUri: `${window.location.origin}/callback`,
                    });
                }
                window.LiveChatWidget?.call('hide');
                redirectToLogin(false, getLanguage());
            }}
            tertiary
        />
    );
};

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
