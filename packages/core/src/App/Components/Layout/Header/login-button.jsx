import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Button } from '@deriv/components';
import { useOauth2 } from '@deriv/hooks';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { isProduction } from '../config/config';

const LoginButton = ({ className }) => {
    const { isOAuth2Enabled } = useOauth2({});
    const has_wallet_cookie = Cookies.get('wallet_account');
    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                if (has_wallet_cookie) {
                    if (isProduction()) {
                        location.href = 'https://hub.deriv.com/tradershub/login';
                    } else {
                        location.href = 'https://staging-hub.deriv.com/tradershub/login';
                    }
                }
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
