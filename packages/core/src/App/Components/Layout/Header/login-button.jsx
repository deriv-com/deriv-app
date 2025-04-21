import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Button } from '@deriv/components';
import { isStaging, redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';

const LoginButton = ({ className }) => {
    const is_deriv_com = /deriv\.(com)/.test(window.location.hostname);
    const has_wallet_cookie = Cookies.get('wallet_account');
    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                if (has_wallet_cookie) {
                    if (isStaging()) {
                        location.href = 'https://staging-hub.deriv.com/tradershub/login';
                    } else {
                        location.href = 'https://hub.deriv.com/tradershub/login';
                    }
                }
                if (is_deriv_com) {
                    try {
                        await requestOidcAuthentication({
                            redirectCallbackUri: `${window.location.origin}/callback`,
                            postLoginRedirectUri: window.location.href,
                        }).catch(err => {
                            // eslint-disable-next-line no-console
                            console.error(err);
                        });
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.error(err);
                    }
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
